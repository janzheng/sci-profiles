

export const login = ({email, password, session}) => {

  console.log('loggin in....', email, password, JSON.stringify({ email, password }) )

	return fetch(`api/login`, {
		method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
	}).then(async (response) => {
		console.log('response:', response)

		if(response.status === 403)
			return Promise.reject()

		let data = await response.json()

		if (data.user) {
			session.set({ user: data.user });
			return Promise.resolve()
		}
	})
}



export const signup = ({email, password, session}) => {

  console.log('signing up....', email, password, JSON.stringify({ email, password }) )

  try {
		return fetch(`api/signup`, {
			method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({ email, password }),
		}).then(async (response) => {
			console.log('response:', response)

			if(response.status === 409)
				return Promise.reject()

			let data = await response.json()

			if (data.user) {
				session.set({ user: data.user });
				return Promise.resolve()
			}
		})
  } catch(err) {
  	console.log('auth-helper signup error', err)
  }
}



export	const logout = (session) => {
	console.log('logging out ... ', session)
	return fetch(`api/logout`).then(response => {
		console.log('logged out:', response)
		session.set({ user: null });
		return Promise.resolve()
	})
}



