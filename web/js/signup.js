import { $ } from './common.js'
import { signup } from './api.js'

$('form').onsubmit = async e => {
	const email = $('#email').value
	const username = $('#username').value
	const password = $('#password').value

	e.preventDefault()

	const response = await signup(email, username, password)
	const { message } = await response.json()

	if (response.status != 200)
		return alert(`Error! The user was not created. ${message}`)

	alert('Check your email for a verification link.')
}
