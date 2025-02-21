import { $ } from './common.js'
import { verify } from './api.js'

$('form').onsubmit = e => {
	const username = $('#username').value
	const verificationCode = $('#verification-code').value

	e.preventDefault()

	const response = verify(username, verificationCode)
	console.log(response)

	if (response.status != 200)
		return alert('Error! The account was not verified.')

	alert('Account verified successfully!')
}
