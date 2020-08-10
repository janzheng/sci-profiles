
/*

	Helpers specifically for each site or domain

*/



import { saveSetup, save } from '../save.js'


export const addProfileForNewUser = async (_user) => {

  const record = await save({
    tableName: 'Profiles',
    payload: {
    	Accounts: [_user.recordId],
    	Name: _user['fullName'] || undefined,
    },
    insertOptions: ['typecast'],
    baseKey: {
    	apiWriteKey: process.env.SCIPRO_CREATOR_API,
    	baseId: process.env.SCIPRO_BASE,
    }
  })

  return record
}