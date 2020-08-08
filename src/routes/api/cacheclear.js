

import { cacheClear } from "../../_utils/cache"

export function get(req, res, next) {

  const { src } = req.query

  console.log('src', src)

  try {
    cacheClear(src)
    res.writeHead(200)
    res.end(`Cache cleared for: ${src ? src : 'all cached content'}`)
  } catch (error) {
  	console.error('[cacheclear] error', error)
    next(error)
  }
}