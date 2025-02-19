import { $ } from './common.js'

$('#toggle-nav').onclick = e =>
	e.target.parentElement.classList.toggle('grow')
