
/*

	compare passwords

*/


// https://gist.github.com/nemtsov/6c2c24fa565a29404b487c61ce5bae4f

import passport from 'passport'
// import send from '@polka/send'

import { comparePasswords } from '../../../_utils/auth/auth-helpers'
import { findUserByEmail } from '../../../_utils/auth/auth-users'
import { sendData } from '../../../_utils/sapper-helpers'


export async function post(req, res, next) {
  try {
		const {email, password} = req.body
    const user = await findUserByEmail(email)

    if(user) {
    	const compare = comparePasswords(password, user.password)

      return sendData({
        status: false,
        message: 'The details provided are valid'
      }, res)

    }

    return sendData({
      status: false,
      message: 'The details provided are not valid'
    }, res)

  } catch (error) {
    console.error('[api/auth/verify-password] error:', error)
    // next(error)
  }

}

