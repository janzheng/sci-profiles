
// logs into fauna
import { query as q } from 'faunadb'
import faunadb from 'faunadb'


export const logout = async faunaSecret => {
	const faunaClient = new faunadb.Client({secret: faunaSecret})
  const ref = await faunaClient.query(q.Logout(false))
  return true
}



export function get(req, res, next) {

	console.log('logout request ...', req.session.user)

  const user = req.session.user

  if (!user) {
  	// already logged out
  	res.statusCode = 200
  	res.end()
  }

  try {
		logout(user).then((result) => {
			console.log('logged out! ')
		  req.session.user = null
  		res.statusCode = 200
			res.end()
		}).catch((err) => {
			console.error('logout.js fauna something went wrong / already logged out?', err)
  		req.session.user = null
  		res.statusCode = 200
			res.end()
			// throw new Error(err)
		})
  } catch(err) {
			console.error('logout.js something went wrong', err)
			throw new Error(err)
  }
}
