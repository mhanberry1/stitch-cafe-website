import { $ } from './common.js'
import cart from './cart.js'

$('#toggle-nav').onclick = e =>
	e.target.parentElement.classList.toggle('grow')

cart.updateIndicator()
