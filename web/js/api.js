const endpoint = location.host == "localhost"
	? "http://localhost:8080"
	: "https://api.stitch.cafe:8080"

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

export const checkout = (
	stripeLineItems,
	pickup,
	includesPhysicalItems,
) => fetch(
	`${endpoint}/checkout`,
	{
		method: 'POST',
		body: JSON.stringify({
			stripeArgs: {
				success_url: `${location.origin}/success.html`,
				line_items: stripeLineItems,
				mode: 'payment',
				shipping_address_collection: !pickup && includesPhysicalItems
					? {
						allowed_countries: ['US'],
					} : undefined,
				custom_text: {
					submit: {
						message: pickup
							? 'You will receive an email when your order is ready to be picked up at Stitch Cafe!'
							: undefined,
					},
				},
				customer_creation: 'always',
				billing_address_collection: 'required',
				phone_number_collection: {
					enabled: true,
				},
				metadata: {
					pickup: pickup
						? 'Order will pickup at the shop'
						: undefined,
				},
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
