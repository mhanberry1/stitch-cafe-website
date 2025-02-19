import { $ } from './common.js'
import { signup } from './api.js'

$('form').onsubmit = e => {
	const email = $('#email').value
	const username = $('#username').value
	const password = $('#password').value

	e.preventDefault()

	const response = signup(email, username, password)

	if (response.status != 200)
		return alert('Error! The user was not created.')

	alert('Check your email for a verification link.')
}
