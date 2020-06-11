/*

	Simple wrapper around caching
	- nodecache to start
	- file-based or fauna-based caching later
	- wrapper makes swapping easier


*/
import NodeCache from 'node-cache'

const nodecache = new NodeCache()



export const cacheGet = src => {
	console.log('cacheGet',src, typeof nodecache.get(src))
	return nodecache.get(src)
}

export const cacheSet = (src, data, ttl) => {
	console.log('cacheSet',src,ttl)
  return nodecache.set(src, data, ttl)
}