

// password reset / forgot password

import { hashPassword, getToken, getShortToken } from '../../../_utils/auth/auth-helpers'
import { findUserByEmail } from '../../../_utils/auth/auth-users'
import { notifyReset } from '../../../_utils/auth/auth-templates'
import { sendData } from '../../../_utils/sapper-helpers'


export async function post(req, res, next) {
  try {

		const {email, password} = req.body
	  const user = await findUserByEmail(email)

	  // note: this causes a slight delay when users are detected, which can 
	  // cause users to "sniff" real vs. fake addresses
	  // leaving it outside the user check means wasted cycles though
    if(user) {

			const {token, tokenExpires} = await notifyReset(email, req.headers.host)
		  // const message = `
	   //    You are receiving this because you (or someone else) have requested the reset of the password for your account.
	   //    Please click on the following link, or paste this into your browser to complete the process:
	   //    http://${req.headers.host}/reset/${token}
	   //    If you did not request this, please ignore this email and your password will remain unchanged.
	   //  `

	  	// await notify({
	  	// 	subject: 'Password reset request',
	  	// 	html: message,
	  	// 	text: message,
	  	// 	fromName: 'Phage Directory',
	  	// 	to: email,
	  	// })

		  // user.resetToken = token
		  // user.resetExpires = tokenExpires
    }

	  // show this message even on users that don't exist, for security
	  // bad ux, good security
	  return sendData({
	    status: true,
	    message: `A reset e-mail has been sent to ${email}`, 
	  }, res)

  } catch (error) {
  	console.error('[api/auth/forgot] error', error)
    // next(error)
  }

}



