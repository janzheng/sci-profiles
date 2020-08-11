
import { query as q } from 'faunadb'
import faunadb from 'faunadb'


export const getComments = async (locId) => {

  try {
    
    const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })

    let comments

    console.log('LOC ID GRABBING:', locId)

    if(!locId) {
	    comments = await client.query(
	      q.Map( // array of comments
	        q.Paginate(
	          q.Match(q.Index('all-comments')),
	          { size: 100 }
	        ),
	        q.Lambda('X',q.Get(q.Var('X')))
	      )
	    )
    } else {
	    comments = await client.query(
	      q.Map( // array of comments
	        q.Paginate(
	          q.Match(q.Index('comments-by-location'), locId),
	          { size: 100 }
	        ),
	        q.Lambda('X',q.Get(q.Var('X')))
	      )
	    )
    }

		// const data = await response.json();
    // console.log('comments:', comments)

    // whitelist
    const clean = {data: comments.data.reduce((acc,val) => {
      // console.log('messages::::', val)
      return [...acc, {
        comment: val.data.comment,
        _phid: val.data._phid,
        locId: val.data.locId,
        ts: val.ts,
      }]
    },[])}

    return clean
  } catch (error) {
    console.error('[getComments] error', error)
  }

}




// locId: (optional) specifies the slug or location of the post (for perma-url)
// user: user info; use _phid to track back to the user
// post: post data (usually a message) 
export const postComment = async (locId, user, comment) => {

  const client = new faunadb.Client({ secret: process.env.FAUNA_COMMENTS_KEY })

  console.log('postComment:', locId, user, comment)

  const data = {
		_phid: user['_phid'],
		comment,
		locId,
  }

  const queryResponse = await client.query(
    q.Create(
    	q.Collection('Comments'),
    	{data} // shape is { data: } — we want the data object in here
    )
  )

  return queryResponse
}




// export async function post(req, res, next) {

//   const { sigName, sigMessage, sigPointer } = req.body
//   const secret = req.session.secret

//   try {
    
// 		// const user = await getProfile(secret)
//   	console.log('[messages] creating signature::::', sigName, sigMessage, sigPointer)

//     const client = new faunadb.Client({ secret: process.env.FAUNA_GUESTBOOK_KEY })

//     const data = {
// 			username: sigName,
// 			message: sigMessage,
// 			pointer: sigPointer
//     }
//     const queryResponse = await client.query(
//       q.Create(
//       	q.Collection('Guestbook'),
//       	{data} // shape is { data: } — we want the data object in here
//       )
//     )

//     // const signatureInfo = { name: queryResponse.data.name, message: queryResponse.data.message, _ts: queryResponse.ts, ref: queryResponse.ref}
//  		// console.log('sig info / success!', signatureInfo)

// 		// const data = await response.json();
// 		res.writeHead(200, { 'Content-Type': 'application/json' })
// 		res.end(JSON.stringify(data))

//   } catch (error) {
//     console.error('signature.js create error:', error)
//     res.statusCode = 403
//     res.end()
//     // next(error)
//   }
// }


