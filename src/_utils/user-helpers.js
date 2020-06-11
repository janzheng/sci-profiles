

// remove caches
// export const logoutProfile

export const getUserData = async (session) => {

	try {
		if(!session)
			throw new Error('Please provide session')

	  // console.log('[user-helpers] getting user data', )

		let response = await fetch(`api/users`)

		console.log('response:', response)

		if(response.status !== 200)
			return Promise.reject()

		let userData = await response.json()

		// if (session) {
		session.set({ userData: userData });
		// }

		return Promise.resolve(userData)
	} catch(err) {
		console.error('[user-helpers] error:', err)
	}
}



export const saveUserData = async (session, data) => {

	try {
		if(!session || !data)
			throw new Error('Please provide session and data')

	  // console.log('[user] saving user data', data)

		const response = await fetch(
			`/api/users`, {
			headers: {
	      'Content-Type': 'application/json'
	    },
			method: 'POST',
			body: JSON.stringify(data)
		})

		return Promise.resolve(response)

	} catch(err) {
		console.error('[user-helpers] error:', err)
	}
}







// export const signup = ({email, password, session}) => {

//   console.log('signing up....', email, password, JSON.stringify({ email, password }) )

//   try {
// 		return fetch(`api/signup`, {
// 			method: 'POST',
// 	    headers: { 'Content-Type': 'application/json' },
// 	    body: JSON.stringify({ email, password }),
// 		}).then(async (response) => {
// 			console.log('response:', response)

// 			if(response.status === 409)
// 				return Promise.reject()

// 			let data = await response.json()

// 			if (data.user) {
// 				session.set({ user: data.user });
// 				return Promise.resolve()
// 			}
// 		})
//   } catch(err) {
//   	console.log('auth-helper signup error', err)
//   }
// }



// export	const logout = (session) => {
// 	console.log('logging out ... ', session)
// 	return fetch(`api/logout`).then(response => {
// 		console.log('logged out:', response)
// 		session.set({ user: null });
// 		return Promise.resolve()
// 	})
// }



