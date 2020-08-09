

// ex:  https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
//      https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
//  // the `slug` parameter is available because this file
//  // is called [slug].json.js
//  const { slug } = req.params;

//  const article = await db.get(slug);

//  if (article !== null) {
//    res.setHeader('Content-Type', 'application/json');
//    res.end(JSON.stringify(article));
//  } else {
//    next();
//  }
// }

import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear } from "../../../_utils/cache"
import { getContentFromTable } from "../../../_utils/notion"
import { sendData } from "../../../_utils/sapper-helpers" 
import { saveSetup, save } from '../../../_utils/save.js'



config(); // https://github.com/sveltejs/sapper/issues/122

let json
const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'
const domain = process.env.DOMAIN 

const apiReadKey = process.env.SCIPRO_READER_API
const apiWriteKey = process.env.SCIPRO_CREATOR_API
const baseId = process.env.SCIPRO_BASE
const userTableName = 'Profiles'

saveSetup({ // for easy airtable saving
  apiWriteKey: apiWriteKey,
  baseId: baseId,
})

// Gets profiles and filters them by Domain
const getProfile = async () => {
  let cacheStr = `${view}-Content`
  if(domain)
    cacheStr = `${domain}-${cacheStr}`

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
      apiKey: apiReadKey,
      baseId: baseId,
      bases:  bases,
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

// get record of a profile
export const getProfileById = async (id) => {
  let cacheStr = `profile-${id}`
  if (cacheGet(cacheStr))
    return cacheGet(cacheStr)

  const record = await Cytosis.getRecord({
    recordId: id,
    tableName: 'Profiles',
    apiKey: apiReadKey,
    baseId: baseId,
  })
  
  cacheSet(cacheStr, record, 60*60 )
  return record
}



// save profile back to airtable
export const saveProfile = async (profile) => {

  // const {recordId, Name, PublicEmail, Social, Pitch, Title, CV} = profile
  const recordId = profile.recordId
  delete profile.recordId

  try {
    const record = await save({
      tableName: 'Profiles',
      payload: profile,
      recordId,
      insertOptions: ['typecast']
    })

    cacheClear(`profile-${recordId}`)
    return record

  } catch(e) {
    console.error('saveProfile error:', e)
  }
}










export async function get(req, res) {
  const { id } = req.query
  let profile

  try {
    if(id)
      profile = await getProfileById(id)
    else
      profile = await getProfile()

    if(profile.fields['Domain']) {
      profile['Domain'] = domain 
    }

    if(profile.fields['ContentSource'] === 'Notion' && profile.fields['NotionTableId'])
      profile['Notion'] = await getContentFromTable(profile.fields['NotionTableId']) 

    // console.log('Profile:::', profile)

    return sendData(profile, res)
  } catch(err) {
    throw new Error('[api/cytosis] Error', err)
  }
}




export async function post(req, res) {
  // const {Name, PublicEmail, Social, Pitch, Title, CV} = req.body

  try {
    const profile = await saveProfile(req.body)
    return sendData(profile, res)
  } catch(err) {
    throw new Error('[api/post] Error', err)
  }
}





