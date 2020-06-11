
/*

  Documentation / Notes

  Gets profile info of a user
  
  - GET api/profile
    - gets all profile data

  - GET api/profile/{profile}
    - gets a person's profile data based on profile slug

*/




import send from '@polka/send';
import Cytosis from 'cytosis';
import { config } from "dotenv";

import { cacheGet, cacheSet } from "../../../_utils/cache"



config(); // https://github.com/sveltejs/sapper/issues/122
let json;

const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'



// get the entire profile db
export const getProfiles = async () => {

  const apiReadKey = process.env.PDV4_PUBLIC_API
  const baseId = process.env.PROFILE_AIRTABLE_BASE

  const _cache = cacheGet( `${view}-Profile` )
  if (_cache)
    return _cache

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          "view": view,
        }
      },
    ],
    routeDetails: '[api/profile/getProfiles]',
  })
  cacheSet( `${view}-Profile`, cytosis.results['Profiles'], 60*60 );
  return cytosis.results['Profiles']
}







export const getProfile = async (slug) => {

  const apiReadKey = process.env.SCIPRO_READER_API
  const baseId = process.env.SCIPRO_BASE

  const _cache = cacheGet( `${view}-Profile/${slug}` )
  if (_cache)
    return _cache

  const cytosis = await new Cytosis({
    apiKey: apiReadKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Profiles'],
        options: {
          "view": view,
          keyword: `${slug}`,
          matchKeywordWithField: 'Slug',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/profile/getProfile]',
  })
  cacheSet( `${view}-Profile/${slug}`, cytosis.results['Collections'], 60*60 );
  return cytosis.results['Profiles']
}






// attach Collections and Organizations
export const amendProfile = async (profile) => {

  const slug = profile.fields['Slug']

  const collections = await getCollectionFromProfile(slug)
  profile['Collections'] = collections ? collections : []

  const organizations = await getOrgFromProfile(slug)
  profile['Organizations'] = organizations ? organizations : []

  return profile
}







export async function get(req, res) {
  try {
    const { profile } = req.params
    let _result 

    if(profile) {
      _result = await getProfile(profile)
    } 
    else {
      _result = await getProfiles()
    }

    if(_result) {
      
      // delete _result['apiKey']
      // delete _result['baseId']

      const json = JSON.stringify(_result)
      send(res, 200, json, {
        'Content-Type': 'application/json'
      });
      return 
    }
  } catch(e) {
    console.error('[api/profile/get]', e)
    send(res, 500, JSON.stringify(e));
  }
}








