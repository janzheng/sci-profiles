
// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'



export function post(req, res, next) {

  const { email, password } = req.body


  try {
    if (!email || !password) {
      throw new Error('Email and password must be provided.')
    }
    
    const client = new faunadb.Client({ secret: process.env.FAUNA_SERVER_KEY })

    client.query(
      q.Login(q.Match(q.Index('users_by_email'), email), {
        password,
      })
    ).then((result) => {

	    if (!result.secret) {
	      throw new Error('No secret present in login query response.')
	    }

		  // const data = await response.json();
			res.writeHead(200, { 'Content-Type': 'application/json' })
		  req.session.user = result.secret
			res.end(JSON.stringify({user: result.secret}))
    }).catch((err) => {
    	// console.error('login.js/fauna nope', err)
	      // throw new Error('Noped out.')
      console.error('login.js noped out / login incorrect', err)
      res.statusCode = 403
      res.end()
    })

  } catch (error) {
  	console.error('login.js noped out', error)
    next(error)
  }

}