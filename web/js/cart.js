import { $ } from './common.js'

class Cart {
	#items

	constructor() {
		this.#items = JSON.parse(
			localStorage.getItem('cart') || '{}'
		)
	}

	getItems() {
		return this.#items
	}

	addItem(stripeProductId, purchaseQuantity) {
		this.#items[stripeProductId] = purchaseQuantity

		localStorage.setItem('cart', JSON.stringify(this.#items))

		if (!$('#cart-indicator')) return

		$('#cart-indicator').textContent = Object.keys(this.#items.length)
	}

	removeItem(stripeProductId) {
		delete this.#items[stripeProductId]
		localStorage.setItem('cart', JSON.stringify(this.#items))

		if (!$('#cart-indicator')) return

		$('#cart-indicator').textContent = Object.keys(this.#items.length)
	}

	clearItems() {
		this.#items = {}
		localStorage.setItem('cart', '{}')

		if (!$('#cart-indicator')) return

		$('#cart-indicator').textContent = Object.keys(this.#items.length)
	}
}

export default new Cart()
