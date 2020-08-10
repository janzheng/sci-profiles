
// https://gist.github.com/nemtsov/6c2c24fa565a29404b487c61ce5bae4f

import passport from 'passport'
// import send from '@polka/send';

import { sanitizeUserForClient, hashPassword } from '../../../_utils/auth/auth-helpers'
import { addUser, users, findUserByEmail } from '../../../_utils/auth/auth-users'
import { sendData } from '../../../_utils/sapper-helpers'
import { addProfileForNewUser } from '../../../_utils/auth/auth-custom'



export async function post(req, res, next) {
  try {

		const {email, password} = req.body

    const existingUser = await findUserByEmail(email)

    if(!existingUser) {
			const user = {
		    email,
		    password,
		  }

		  const _user = await addUser(user)

		  return req.login(_user, async (err) => {
		    if (err) next(err);
		    else {
		    	// create a new record in Profiles that's linked to the Account
		    	const record = await addProfileForNewUser(_user)

			    // console.log('new profile record: USER::::', _user)
		    	return sendData({
			  		status: true,
			  		message: 'Signed up!',
		    		user: sanitizeUserForClient(_user)
		    	}, res)
				}
		  });
    }

    // should this trigger an email reminder?
  	return sendData({
  		status: false,
  		message: 'Please try using another email address'
  	}, res)

  } catch (error) {
  	console.error('[api/auth/signup] error:', error)
    // next(error)
  }

}

