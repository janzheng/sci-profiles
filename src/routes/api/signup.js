
// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'



export async function post(req, res, next) {

  const { email, password } = req.body

  console.log('signup.js signing up!', email, password)

  try {
    if (!email || !password) {
      throw new Error('Email and password must be provided.')
    }


    let user
  	const client = new faunadb.Client({ secret: process.env.FAUNA_SERVER_KEY })


    try {
      user = await client.query(
        q.Create(q.Collection('User'), {
          credentials: { password },
          data: { email },
        })
      )
    } catch (error) {
      console.error('Fauna create user error:', error)
      throw new Error('User already exists.')
    }

    if (!user.ref) {
      throw new Error('No ref present in create query response.')
    }

    const loginRes = await client.query(
      q.Login(user.ref, {
        password,
      })
    )

    if (!loginRes.secret) {
      throw new Error('No secret present in login query response.')
    }


	  // const data = await response.json();
		res.writeHead(200, { 'Content-Type': 'application/json' })
	  req.session.user = loginRes.secret
		res.end(JSON.stringify({user: loginRes.secret}))

  } catch (error) {
  	console.error('signup.js noped out / user exists', error)
  	res.statusCode = 409
		res.end()
    throw new Error('No secret present in login query response.')
  }

}