

import { getComments, postComment } from '../../../_utils/fauna/comments'
import { sendData } from "../../../_utils/sapper-helpers" 

export async function get(req, res, next) {

	const { locId } = req.query

	try {
		const comments = await getComments(locId)

		// console.log('comments: ', comments)
		sendData(comments, res)
	} catch(e) {
		console.error('[api/comments] error:', e)
	}
}



export async function post(req, res, next) {

  const { locId, comment } = req.body
	const user = req.user

	if(!user) {
  	console.error('[api/comments] no user / not logged in?')
	}

	try {
		const response = await postComment(locId, user, comment)

		console.log('response :::', response)
		sendData(response, res)
	} catch(e) {
		console.error('[api/comments] error:', e)
	}
}