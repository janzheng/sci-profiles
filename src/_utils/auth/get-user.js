

/*

	Helper. Used by front-end to grab the user on mount.

	Last updated: 8/9/2020
	
*/

import { logger, logerror } from '../logger';

export const getUser = async () => {
  try {
    const response = await fetch(`api/passport/login`)
    if(response.status == 200) {
      const results = await response.json()
      if(results.user) 
        return results.user
    } else {
      // error = err
      logger('[get-user]', 'error:', results)
    }
  } catch (err) {
    console.error(err)
    loggerror('[mount-user]', 'Error:', err)
  }

  return undefined
}