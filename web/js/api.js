const endpoint = location.host == "localhost"
	? "http://localhost:8080"
	: "<TODO>"

export const signup = (email, username, password) => fetch(
	`${endpoint}/user/signup`,
	{
		method: 'POST',
		credentials: 'include',
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
		credentials: 'include',
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
		credentials: 'include',
		body: JSON.stringify({
			username,
			password,
		}),
	}
)

export const logout = () => fetch(
	`${endpoint}/user/logout`,
	{
		credentials: 'include',
	},
)

export const listProducts = stripeProductIds => fetch(
	`${endpoint}/products` + (stripeProductIds
		? `?stripeProductIds=${JSON.stringify(stripeProductIds)}`
		: ''
	),
	{
		credentials: 'include',
	}
)

export const createProducts = products => fetch(
	`${endpoint}/products`,
	{
		method: 'PUT',
		credentials: 'include',
		body: JSON.stringify({ products }),
	}
)

export const updateProducts = products => fetch(
	`${endpoint}/products`,
	{
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({ products }),
	}
)

export const deleteProducts = stripeProductIds => fetch(
	`${endpoint}/products`,
	{
		method: 'DELETE',
		credentials: 'include',
		body: JSON.stringify({ stripeProductIds }),
	}
)

export const checkout = stripeLineItems => fetch(
	`${endpoint}/checkout`,
	{
		method: 'POST',
		body: JSON.stringify({
			stripeArgs: {
				success_url: `${location.origin}/success.html`,
				line_items: stripeLineItems,
				mode: 'payment',
			},
		}),
	}
)

export const uploadFiles = files => {
	const formData = new FormData()

	Array.from(files).forEach(
		file => formData.append('files', file)
	)

	return fetch(
		`${endpoint}/upload`,
		{
			method: 'POST',
			credentials: 'include',
			body: formData,
		}
	)
}
