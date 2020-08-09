

/*

	Auth User Management

	— swap the user out for Fauna, Cytosis, or other back-end
  - uses an array for testing

*/

import passport from 'passport'
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'
import TwitterStrategy from 'passport-twitter'
import GithubStrategy from 'passport-github2'
import FacebookStrategy from 'passport-facebook'
import OrcidStrategy from 'passport-orcid'

import ProtocolsioStrategy from './protocolsio-strategy'

import { hashPassword, comparePasswords } from './auth-helpers.js'



// for testing only
export const users = [];

// for testing only — creates circular dep
export const initUsers = async () => {
	const pass = await hashPassword('testtest')
	users.push({
	  id: 'local/a0234aDdfj-2f4sdfa3oEerq-2U4',
	  fullName: 'User X',
	  email: 'janeazy@gmail.com',
	  password: pass,
	},  {
    id: 'local/a0234aDdfj-2f4sdfa3oEerq-ABC',
    fullName: 'Boy Good',
    email: 'hello@janzheng.com',
    password: 'woofwoof',
    token: '$2a$10$t1fuE9N6O2Vt9Q7XRgQv0.QfVWqHzVrwZRGx/bJaWE90Y7yYZcQo.',
    tokenExpires: 1596479017110,
    // 8dfe8163e123ac85bd25
  },
	 {
	  id: 'google/114420147382433900437',
	  email: undefined,
	  fullName: 'Jan Zheng',
	  profile: {
	    id: '114420147382433900437',
	    displayName: 'Jan Zheng',
	    name: [Object],
	    photos: [Array],
	    provider: 'google',
	    _raw: '{\n' +
	      '  "sub": "114420147382433900437",\n' +
	      '  "name": "Jan Zheng",\n' +
	      '  "given_name": "Jan",\n' +
	      '  "family_name": "Zheng",\n' +
	      '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GjYRg-In1Q0a7eNQwhYGBiUB4Oh-RpXLQd8TOE36g",\n' +
	      '  "locale": "en"\n' +
	      '}',
	    _json: [Object]
	  },
	  tokens: {
	    accessToken: 'ya29.a0AfH6SMBq5Yz-Tj3llzAnUjSHIEpldZIow7z4KDZd_-3SxkE_9F1PSnPfsZzvnPB1M4Z1GPILPM1mYs3g1jZvXis7mLbYBdMmJhJw6rCqJkDCUGkhoyUxlP6KgWjVHUEIdbGp6XRGHHmS23YGlIHiFhXMabm1xTpppD4',
	    refreshToken: undefined
	  }
	}
  )
}



// for external services like server.js
export const getPassport = () => {
	return passport
}





export const addUser = async (user) => {
  // handle signup properly here, w/ a helper
  users.push(user);
}

export const findUserById = async (_userId) => {
	const user = users.find(u => {
		return u.id === _userId
	});
	// console.log('finding user by id:', _userId, user)
	return user
}

export const findUserByEmail = async (email) => {
	const user = users.find(u => {
		return u.email === email
	});
	return user
}




export const findUserByToken = async (token, _activateUser=false) => {

	const _users = []
	// used for magic link login
  const pusers = users.map(async u => {
		// console.log('getting user from...', token, u.token, u.tokenExpires)
  	if(token && u.token) {
  		const compare = await comparePasswords(token, u.token)
  		// console.log('compare:', compare, u.tokenExpires > Date.now())
  		if ((u.tokenExpires > Date.now()) && compare) {
  			// console.log('user found!!!', u)
  			_users.push(u)
  			return Promise.resolve(u)
  		}
  	} 
  	// else {
  	// 	return Promise.reject(false)
  	// }
  })

  return Promise.all(pusers).then((users) => {
  	console.log('users....', _users)
  	// return Promise.resolve(users[0])

  	let user = _users[0]

  	if(_activateUser)
  		user = activateUser(user)

  	// console.log('activated?', user)

  	return deleteTokensFromUser(user)
  }).catch((err) => {
  	console.error('findUserByEmail error:', err)
  	return false
  })
}





export const resetPasswordFromToken = async (token, plaintextPassword) => {
  const user = await findUserByToken(token)
  // console.log('reset password:', token, plaintextPassword, user)

  if(!user)
  	return false

  user.password = await hashPassword(plaintextPassword)
  delete user.resetToken;
  delete user.resetExpires;
  return sanitizeUserForClient(user)
}



export const deleteTokensFromUser = (user) => {
	// magic link tokens
  delete user.token;
  delete user.tokenExpires;

  delete user.verifyExpires;
  delete user.verifyToken;
  delete user.verifyShortToken;
  delete user.verifyChanges;

  delete user.resetExpires;
  delete user.resetToken;
  delete user.resetShortToken;

  return user
}



export const activateUser = (user) => {
	// activate a user's account
	// ** this is meant to be a modular fn
  user['activeStatus'] = true;
  return user
}

































/*

	Passport setup

	note this also needs to be setup on Sapper's server.js as middleware
	- import passport from server.js
	- initialize passport and session
	- add passport to sapper.middleware

*/

// used by passport for sessions / cookie token
// here we use the "id" as the cookie identifier
passport.serializeUser((_user, cb) => {
	return cb(null, _user.id);
})
passport.deserializeUser(async (_userId, cb) => {
	// return cb(null, u);
	const user = await findUserById(_userId)
  cb(null, (user ? user : false))
})

// can configure this to work w/ Fauna or even Airtable
passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, cb) => {
  const user = await findUserByEmail(email)
  let passwordCompare
  try {
  	passwordCompare = await comparePasswords(password, user.password)
  } catch (e) {
  	console.error('Unsuccessful login compare', e)
  	// unsuccessful login
  }
  cb(null, (user && passwordCompare) ? user : false);
}));


// Google login strat
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/google-callback`
}, async (accessToken, refreshToken, profile, cb) => {

  const newUser = {
    id: `google/${profile.id}`,
    email: profile.email,
    fullName: profile.displayName,
    profile,
    tokens: { accessToken, refreshToken },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	addUser(newUser)
	}

  cb(null, curUser || newUser)
}));

// Twitter login strat
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/twitter-callback`
}, async (token, tokenSecret, profile, cb) => {

  const newUser = {
    id: `twitter/${profile.id}`,
    email: profile.email,
    fullName: profile.displayName,
    profile,
    tokens: { token, tokenSecret },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	await addUser(newUser)
	}

  cb(null, curUser || newUser)
}));

// Github login strat
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/github-callback`
}, async (accessToken, refreshToken, profile, cb) => {

  const newUser = {
    id: `twitter/${profile.id}`,
    email: profile.email,
    fullName: profile.displayName,
    profile,
    tokens: { accessToken, refreshToken },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	await addUser(newUser)
	}

  cb(null, curUser || newUser)
}));


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/facebook-callback`
}, async (accessToken, refreshToken, profile, cb) => {

  const newUser = {
    id: `facebook/${profile.id}`,
    email: profile.email,
    fullName: profile.displayName,
    profile,
    tokens: { accessToken, refreshToken },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	await addUser(newUser)
	}

  cb(null, curUser || newUser)
}));

passport.use(new OrcidStrategy({
  clientID: process.env.ORCID_CLIENT_ID,
  clientSecret: process.env.ORCID_CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/orcid-callback`
}, async (accessToken, refreshToken, params, profile, cb) => {

  const newUser = {
    id: `orcid/${params.orcid}`,
    fullName: params.name,
    params,
    tokens: { accessToken, refreshToken },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	await addUser(newUser)
	}

  cb(null, curUser || newUser)
}));


  // DOESN'T WORK — Protocolsio doesn't support localhost
passport.use(new ProtocolsioStrategy({
	state: true,
	scope: 'readwrite',
  clientID: process.env.PROTOCOLSIO_CLIENT_ID,
  clientSecret: process.env.PROTOCOLSIO_CLIENT_SECRET,
  callbackURL: `localhost:${process.env.PORT}/auth/protocolsio-callback` // Protocols doesn't play nice with localhost
  // callbackURL: `http://localhost:${process.env.PORT}/auth/protocolsio-callback`
}, async (accessToken, refreshToken, params, profile, cb) => {

  const newUser = {
    id: `protocolsio/${params.orcid}`,
    fullName: params.name,
    params,
    tokens: { accessToken, refreshToken },
  };

  // find existing users
  // const curUser = users.find(u => u.id === newUser.id)
  const curUser = await findUserById(newUser.id)

	if(!curUser) { // create one if not found
  	await addUser(newUser)
	}

  cb(null, curUser || newUser)
}));



