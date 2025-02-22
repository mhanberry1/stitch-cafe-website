import { $ } from './common.js'
import { login } from './api.js'

$('form').onsubmit = async e => {
	const username = $('#username').value
	const password = $('#password').value

	e.preventDefault()

	const response = await login(username, password)
	const { message } = await response.json()

	if (response.status != 200)
		return alert('Incorrect login information.')

	localStorage.setItem('isAdmin', true)

	location = '/shop.html'
}
