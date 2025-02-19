import { $ } from './common.js'
import { login } from './api.js'

$('form').onsubmit = e => {
	const username = $('#username').value
	const password = $('#password').value

	e.preventDefault()

	const response = login(username, password)

	if (response.status != 200)
		return alert('Incorrect login information')

	location = 'admin.html'
}
