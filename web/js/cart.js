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
		this.updateIndicator()
	}

	removeItem(stripeProductId) {
		delete this.#items[stripeProductId]
		localStorage.setItem('cart', JSON.stringify(this.#items))
		this.updateIndicator()
	}

	clearItems() {
		this.#items = {}
		localStorage.setItem('cart', '{}')

		if (!$('#cart-indicator')) return

		$('#cart-indicator').textContent = Object.keys(this.#items.length)
		$('#cart-indicator').classList.remove('show')
	}

	updateIndicator() {
		if (!$('#cart-indicator')) return

		const numItems = Object.keys(this.#items).length

		$('#cart-indicator').textContent = numItems
		numItems == 0
			? $('#cart-indicator').classList.remove('show')
			: $('#cart-indicator').classList.add('show')
	}
}

export default new Cart()
