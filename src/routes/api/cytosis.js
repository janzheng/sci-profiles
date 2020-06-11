

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



config(); // https://github.com/sveltejs/sapper/issues/122

let json
const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'
const domain = process.env.DOMAIN 


const getContent = async () => {
	let cacheStr = `${view}-Content`
	if(domain)
		cacheStr = `${domain}-${cacheStr}`
	const cachedContent = cacheGet(cacheStr)

	if (cachedContent) {
		console.log('$: loaded cached controller')
		return Promise.resolve(cachedContent)
	}

	try {
	  let bases = [
	  {
		  tables: ['Content','Profiles'],
		  options: {
		    "view": view,
		  }
	  },
	  // {
		 //  tables: ["Bases"],
	  // },
	  // {
		 //  tables: ["Collections"],
	  // }
	  ]

		// console.log('loading ctrl cytosis...', bases)

	  let _cytosis = await new Cytosis({
	    apiKey: process.env.SCIPRO_READER_API,
	    baseId: process.env.SCIPRO_BASE,
	    bases: 	bases,
	    routeDetails: '[scipro/getContent]',
	  })


		if(domain) {
			_cytosis.results['Profile'] = _cytosis.results['Profiles'].filter(profile => profile.fields['Domain'] == domain)[0]
		}
	  
	  const data = _cytosis.results
		cacheSet(cacheStr, data, 60*60 );
		return Promise.resolve(data)

	} catch(err) {
		throw new Error('[faves/getContent] Error', err)
	}
}






export async function get(req, res) {
	try {
		const _result = await getContent('Content')
		// console.log('ctrl cytosis loaded:', _result)

		if(domain) {
			_result['Domain'] = domain 
		}

    const json = JSON.stringify(_result)
    send(res, 200, json, {
      'Content-Type': 'application/json'
    });
	} catch(err) {
		throw new Error('[faves/get] Error', err)
	}
}







// export function post(req, res) {

// 	res.writeHead(200, { 'Content-Type': 'application/json' })
// 	// json = JSON.stringify(req.body)
// 	json = req.body // JSON.parse(json)

// 	const apiEditorKey = process.env.SCIPRO_CREATOR_API
// 	const baseId = process.env.SCIPRO_BASE


// 	// validate?
// 	// console.log('saving >>>', json)
//   const saveToCytosis = async () => {
//     await Cytosis.save({
//     	recordId: json.recordId || null,
//       apiKey: apiEditorKey,
//       baseId: baseId,
//       tableName: 'Profiles',
//       tableOptions: {
//         // insertOptions: ['typecast'],
//       },
//       payload: {
//       	'UserId': json.userId,
//       	'Name': json.name,
//         'Email': json.email,
//       }
//     })
//   }

//   saveToCytosis().then(async (_res) => {
//   	// console.log('saveToCytosis >>> ', _res)

//   	// if(json.mailer && json.mailer.send) {
// 	  // 	try {
// 			// 	const mail = automailer(json.mailer)
// 			//   .then(function (response) {
// 			//     // console.log(response);
// 			// 		res.end('post completed, email sent!')
// 			//   })
// 	  // 	} catch(err) {
// 	  // 		console.error('mail error:', err)
// 	  // 	}
//   	// }

// 		res.end('post/cytosis.js updated!')
//   })

// }






