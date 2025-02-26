import { $, e } from './common.js'
import { listProducts } from './api.js'
import cart from './cart.js'

const items = cart.getItems()
const { products } = await (await listProducts(Object.keys(items))).json()

const minus = (container, stripeProductId) => {
	console.log(container)
	const currentVal =
		parseInt($('#purchase-quantity', container).value) || 1
	$('#purchase-quantity', container).value =
		Math.max(1, currentVal - 1)
	cart.addItem(stripeProductId, $('#purchase-quantity', container).value)
}

const plus = (container, stripeProductId, maxQuantity) => {
	const currentVal =
		parseInt($('#purchase-quantity', container).value) || 1
	$('#purchase-quantity', container).value =
		Math.min(maxQuantity, currentVal + 1)
	cart.addItem(stripeProductId, $('#purchase-quantity', container).value)
}

const changeQuantity = (target, stripeProductId, maxQuantity) => {
	const currentVal = parseInt(target.value) || 1
	target.value = currentVal < 1
		? 1
		: Math.min(maxQuantity, currentVal)
	cart.addItem(stripeProductId, target.value)
}

const removeItem = (container, stripeProductId) => {
	container.remove()
	cart.removeItem(stripeProductId)

	if (cart.getItems().length > 0) return

	$('#cart-items').textContent = 'There are no items in your cart!'
}

const renderItem = (
	stripeProductId,
	name,
	image,
	purchaseQuantity,
	maxQuantity,
	price
) => {
	$('#cart-items').append(
		e('div', { class: 'item' }, [
			e('a',
				{
					href: `/product.html?stripeProductIds=["${stripeProductId}"]`
				},
				[
					e('img', {
						class: 'item-image',
						href: image,
						onerror: e => e.target.src = '/img/placeholder.png',
					}),
				]
			),
			e('h2', {}, [name]),
			e('div', { class: 'row' }, [
				e('span', { id: 'price' }, ['$' + price]),
				e('span', { id: 'max-quantity' }, [`(${maxQuantity} left)`]),
			]),
			e('div', { class: 'row' }, [
				e('div', { class: 'quantity-container' }, [
					e('button', {
						id: 'minus',
						class: 'button small',
						onclick: e => minus(
							e.target.closest('.item'),
							stripeProductId,
						),
					}, ['-']),
					e('input', {
						id: 'purchase-quantity',
						type: 'number',
						value: purchaseQuantity,
						onchange: e => changeQuantity(
							e.target,
							stripeProductId,
							maxQuantity,
						),
					}),
					e('button', {
						id: 'plus',
						class: 'button small',
						onclick: e => plus(
							e.target.closest('.item'),
							stripeProductId,
							maxQuantity,
						),
					}, ['+']),
				]),
				e('img', {
					id: 'delete-item',
					src: '/img/x.svg',
					onclick: e => removeItem(
						e.target.closest('.item'),
						stripeProductId,
					)
				}),
			]),
		])
	)
}

products.forEach(({
	stripeProductId,
	name,
	images,
	default_price: { unit_amount },
	quantity,
}) => {
	if (!items[stripeProductId]) return

	const purchaseQuantity = Math.min(quantity, items[stripeProductId])
	const price = parseFloat(unit_amount / 100).toFixed(2)

	renderItem(
		stripeProductId,
		name,
		images[0],
		purchaseQuantity,
		quantity,
		price
	)
})

if (Object.keys(items).length == 0) {
	$('#cart-items').textContent = 'There are no items in your cart!'
}
