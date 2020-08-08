

// ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
// 	const { slug } = req.params;

// 	const article = await db.get(slug);

// 	if (article !== null) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify(article));
// 	} else {
// 		next();
// 	}
// }

import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet } from "../../_utils/cache"
import { getContentFromTable } from "../../_utils/notion"
import { sendData } from "../../_utils/sapper-helpers" 



config(); // https://github.com/sveltejs/sapper/issues/122

let json
const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'
const domain = process.env.DOMAIN 


const getProfile = async () => {
	let cacheStr = `${view}-Content`
	if(domain)
		cacheStr = `${domain}-${cacheStr}`
	const cachedContent = cacheGet(cacheStr)

	if (cacheGet(cacheStr)) {
		return cacheGet(cacheStr)
	}

	try {
	  let bases = [
	  {
		  tables: ['Content','Profiles'],
		  options: {
		    "view": view,
		  }
	  },
	  ]

		// console.log('loading ctrl cytosis...', bases)

	  let _cytosis = await new Cytosis({
	    apiKey: process.env.SCIPRO_READER_API,
	    baseId: process.env.SCIPRO_BASE,
	    bases: 	bases,
	    routeDetails: '[scipro/getContent]',
	  })


		if(domain) { // for prototyping make sure the domain matches 
			_cytosis.results['Profile'] = _cytosis.results['Profiles'].filter(profile => profile.fields['Domain'] == domain)[0]
		} else
			return undefined

	  const profile = _cytosis.results['Profiles'][0]
		cacheSet(cacheStr, profile, 60*60 )
		return profile

	} catch(err) {
		throw new Error('[api/cytosis] Error', err)
	}
}






export async function get(req, res) {

	console.log('cytosis get')
	try {
		// const profile = 'wtf is going on'
		const profile = await getProfile()
		// console.log('ctrl cytosis loaded:', profile)

		if(profile.fields['Domain']) {
			profile['Domain'] = domain 
		}

		// console.log('1111111 Profile:::', profile.fields['NotionTableId'])


		if(profile.fields['ContentSource'] === 'Notion' && profile.fields['NotionTableId'])
			profile['Notion'] = await getContentFromTable(profile.fields['NotionTableId']) 

		// console.log('Profile:::', profile)

		return sendData(profile, res)
	} catch(err) {
		throw new Error('[api/cytosis] Error', err)
	}
}





