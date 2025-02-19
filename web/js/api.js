const endpoint = location.host == "localhost"
	? "http://localhost:8080"
	: "<TODO>"

export const signup = (email, username, password) => fetch(
	`${endpoint}/user/signup`,
	{
		method: 'POST',
		body: JSON.stringify({
			email,
			username,
			password,
		}),
	}
)

export const verify = (username, verificationCode) => fetch(
	`${endpoint}/user/verify`,
	{
		method: 'POST',
		body: JSON.stringify({
			username,
			verificationCode,
		}),
	}
)

export const login = (username, password) => fetch(
	`${endpoint}/user/login`,
	{
		method: 'POST',
		body: JSON.stringify({
			username,
			password,
		}),
	}
)
