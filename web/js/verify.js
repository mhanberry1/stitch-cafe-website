import { $ } from './common.js'
import { verify } from './api.js'

$('form').onsubmit = async e => {
	const username = $('#username').value
	const verificationCode = $('#verification-code').value

	e.preventDefault()

	const response = await verify(username, verificationCode)
	const { message } = await response.json()

	if (response.status != 200)
		return alert(`Error! The account was not verified. ${message}`)

	alert('Account verified successfully!')
}
