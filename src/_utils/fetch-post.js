
/*

  Fetch Post

  Util around fetch for post and send on sapper
  - stringifies and calls endpoint as json
  - takes a js object
  - needs to take fetch object since it's not guaranteed we have it

  const response = await fetch(
  `/api/passport/login`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  })

  to:

  const response = await fetchPost(url, data, fetch)

  Last updated: 8/8/2020

*/


export const fetchPost = async (url, data, fetch) => {
  if (!fetch) // server-side won't have access to fetch object
    throw new Error('fetchPost needs access to the fetch object')


  const response = await fetch(
    url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  })

  return response
}
