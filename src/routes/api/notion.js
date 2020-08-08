

import { getContentFromTable } from '../../_utils/notion'
import { sendData } from "../../_utils/sapper-helpers" 

export async function get(req, res, next) {
	let { tableId } = req.query // for pagination

	if(!tableId) {
		sendData('Please provide a tableId query', res, 500)
		return
	}

	const data = await getContentFromTable(tableId)
	sendData(data, res)
}