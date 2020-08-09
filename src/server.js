import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import redirect from '@polka/redirect'

const { json } = require('body-parser');

import session from 'express-session';
import sessionFileStore from 'session-file-store';

import { config } from "dotenv";
config(); // https://github.com/sveltejs/sapper/issues/122

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';


/* Passport.js Auth */
import { initUsers, getPassport } from './_utils/auth/auth-users'
const passport = getPassport()

initUsers() // populate with fake data



const app = polka() // You can also use Express

	.use(
		json(),
		session({
			secret: 'conduit',
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 31536000
			},
			store: new FileStore({
				// path: process.env.NOW ? `/tmp/sessions` : `.sessions`
				path: '/tmp/sessions'
			})
		}),

		compression({ threshold: 0 }),
		sirv('static', { dev }),

		// Setting default values and for debugging purposes
		function(req, res, next) {
		  // console.log('req.session.user:', req.session.user, 'token:',req.session.refresh_token);

		  // if (typeof req.session.user === 'undefined') {
	   //    req.session.user = false;
		  // }
		  next()
		},
  )


  // passport setup
  .use(
		passport.initialize(),
		passport.session(),
	)
  // passport authentication (logging in w/ accounts)
  .get('/auth/google',
  		passport.authenticate('google', { scope: ['profile'] })) // scope: ['https://www.googleapis.com/auth/plus.login'] ?
  .get('/auth/google-callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
  			redirect(res, '/profile')
      })

  .get('/auth/twitter',
  		passport.authenticate('twitter'))
  .get('/auth/twitter-callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      (req, res) => {
  			redirect(res, '/profile')
      })

  .get('/auth/github',
  		passport.authenticate('github'))
  .get('/auth/github-callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      (req, res) => {
  			redirect(res, '/profile')
      })

  .get('/auth/facebook',
  		passport.authenticate('facebook'))
  .get('/auth/facebook-callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      (req, res) => {
  			redirect(res, '/profile')
      })

  .get('/auth/orcid',
  		passport.authenticate('orcid'))
  .get('/auth/orcid-callback',
      passport.authenticate('orcid', { failureRedirect: '/login' }),
      (req, res) => {
  			redirect(res, '/profile')
      })

  .get('/auth/linkedin',
      passport.authenticate('linkedin'))
  .get('/auth/linkedin-callback',
      passport.authenticate('linkedin', { failureRedirect: '/login' }),
      (req, res) => {
        redirect(res, '/profile')
      })

  // .get('/auth/protocolsio',
  // 		passport.authenticate('protocolsio'))
  // .get('/auth/protocolsio-callback',
  //     passport.authenticate('protocolsio', { failureRedirect: '/login' }),
  //     (req, res) => {
  // 			redirect(res, '/passport')
  // })

  // Prototype: Eventually connect and auth should be SEPARATE
  // passport authorization (connecting accounts)
  // for simplification, connect and authentication handled by same strat
  // means that you can't log in w/ oauth while logged in — it'll just connect the two accounts.
  .get('/connect/google',
      passport.authenticate('google', { scope: ['profile'] })) // scope: ['https://www.googleapis.com/auth/plus.login'] ?
  .get('/connect/twitter',
    passport.authorize('twitter', { failureRedirect: '/account' }))
  .get('/connect/github',
      passport.authenticate('github'))
  .get('/connect/facebook',
      passport.authenticate('facebook'))
  .get('/connect/orcid',
      passport.authenticate('orcid'))
  .get('/connect/linkedin',
      passport.authenticate('linkedin'))


  .use(
		sapper.middleware({
      session: (req, res) => ({
				user: req.session && req.session.user
      }),
      passport, // shows up as req.passport
    })
  )
  
console.log('PORT is', PORT)

app.listen(PORT, err => {
  if (err) console.log('error', err);
})
  
export default app.handler


