/*

	Simple wrapper around caching
	- file-based or fauna-based caching later
	- wrapper makes swapping easier

	last updated: 8/8/2020

*/

import NodeCache from 'node-cache'
const nodecache = new NodeCache()
let cacheList = []


export const cacheGet = src => {
	console.log('cacheGet',src, typeof nodecache.get(src))
	return nodecache.get(src)
}

export const cacheSet = (src, data, ttl=60*60) => {
	console.log('cacheSet',src,ttl)
	cacheList.push({src, ttl})
  return nodecache.set(src, data, ttl)
}

export const cacheKeys = () => {
  return {
  	keys: nodecache.keys(),
  	cacheList: cacheList
  }
}

export const cacheClear = (src) => {
	if(src) {
		nodecache.del(src)

		const itemIndex = cacheList.findIndex(c => c.str === src)
		cacheList.splice(itemIndex,1)
		return true
	}

	cacheList.map(cache => {
		nodecache.del(cache.src)
	})
	cacheList = []

	return true
}