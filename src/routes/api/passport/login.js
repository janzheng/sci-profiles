
// https://gist.github.com/nemtsov/6c2c24fa565a29404b487c61ce5bae4f

import passport from 'passport'
// import send from '@polka/send';

import { users } from '../../../_utils/auth/auth-users'
import { sanitizeUserForClient, hashPassword, comparePasswords, getToken, getShortToken } from '../../../_utils/auth/auth-helpers'
import { sendData } from '../../../_utils/sapper-helpers'
import { getProfileById } from '../profile/index'


// this quickly checks if the user is logged in / server session contains the user
export async function get(req, res, next) {
	// passportjs uses session to perform a login on this endpoint
	const user = req.user

	// console.log('get login current user:', user)
	// console.log('users:', users)
	// console.log('get login users:', users)

	// testing password hashing here
	// const testpassword = await hashPassword('banana man!')
	// const testresult = await comparePasswords('banana man!', testpassword)
	// console.log('testpass:', testpassword, testresult)

	// testing tokens
	// const shortToken = await getShortToken(5, false)
	// const token = await getToken(10)
	// console.log('tokens:', shortToken, token)

  if (!user) { 
  	// redirect(res, '/login')
	  return sendData({
	    status: false,
	    message: 'Please check your email and password combination.', 
	  }, res, 200) // error code depends on front-end strategy
	}


	// specific to sc-profiles
	if(user.Profile && user.Profile.length > 0) {
		user['Profile'] = await getProfileById(user.Profile[0]) 
	}

  return sendData({
    status: true,
    message: 'Logged in!', 
    user: sanitizeUserForClient(user),
  }, res)
}




// logs in based on req (req is automatically added by Passport middleware)
export function post(req, res, next) {
  try {
		passport.authenticate('local', function(err, user, info) {
		  if (err) { 
		  	console.error('[api/auth/passport:local] error:', err)
		  	return next(err);
		  }
		  if (!user) { 
			  return sendData({
			    status: false,
			    message: 'No account found for that email/password combination', 
			  }, res)
		  }
		  req.logIn(user, function(err) { // built-in passportjs middleware
		    if (err) { 
			  	console.error('[api/auth/login] error:', err)
			  	return next(err)
			  }
		    // return res.redirect('/users/' + user.username);
		    // after logIn, user data is saved in req.user
		  	// redirect(res, '/profile')
		  	
			  return sendData({
			    status: true,
			    message: 'Successfully logged in!', 
			    user: sanitizeUserForClient(user),
			  }, res)

		  });
		})(req, res, next);

		// passport.authenticate('local', function(err, user, info) {
		//   if (err) { return next(err); }
		//   if (!user) { return res.redirect('/login'); }
		//   req.logIn(user, function(err) {
		//     if (err) { return next(err); }
		//     return res.redirect('/users/' + user.username);
		//   });
		// })(req, res, next);
		
  } catch (error) {
  	console.error('[api/auth/login] error', error)
    // next(error)
  }
}


