

// magic login link

import { sanitizeUserForClient, hashPassword, getToken, getShortToken } from '../../../../_utils/auth/auth-helpers'
import { findUserByToken, findUserByEmail } from '../../../../_utils/auth/auth-users'
import { notifyMagic } from '../../../../_utils/auth/auth-templates'
import { sendData } from '../../../../_utils/sapper-helpers'




// this logs a user in and deletes the token
export async function get(req, res, next) {
  try {

    const { token } = req.params
	  const user = await findUserByToken(token, {deleteTokens: false})

	  if (!user) {
	 	  console.error('Password reset token is invalid or has expired.')
      return sendData({
        status: false,
        message: `Password reset token is invalid or has expired.`, 
      }, res)
	  }

	  req.login(user, (err) => {
	    if (err) next(err);
      return sendData({
        status: true,
        message: `Successfully logged in!`, 
	    	user: sanitizeUserForClient(user),
      }, res)
	  });

	} catch(error) {
    console.error('[api/auth/magic]', error)
    // next(error)
  }
}



// this actually sends out the reset link
export async function post(req, res, next) {
  try {

		const {email} = req.body
	  const user = await findUserByEmail(email)

	  // note: this causes a slight delay when users are detected, which can 
	  // cause users to "sniff" real vs. fake addresses
    if(user) {

			await notifyMagic(email, req.headers.host)
			// const token = await getToken(10)

		  // const message = `
			//    You have requested a link to log into your account.
			//    Please click on the following link, or paste this into your browser to login to your account:
			//    http://${req.headers.host}/magic/${token}
			//    If you did not request this, please ignore this email.
			//  `

			// await notify({
			// 	subject: 'Login request',
			// 	html: message,
			// 	text: message,
			// 	fromName: 'Phage Directory',
			// 	to: email,
			// })

		  // user.token = await hashPassword(token);
		  // user.tokenExpires = Date.now() + 60*60*1000; // one hour expiration

    } else {
    	console.error('Magic link not sent; no account found for ', email)
    }


	  // show this message even on users that don't exist, for security
	  // bad ux, good security
	  return sendData({
	    status: true,
	    message: `A magic link e-mail has been sent to ${email}`, 
	  }, res)


  } catch (error) {
  	console.error('[api/auth/magic]', error)
    // next(error)
  }

}



