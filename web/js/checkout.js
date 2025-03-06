import { $, $$, e } from './common.js'
import { listProducts, checkout } from './api.js'
import cart from './cart.js'

const items = cart.getItems()
const { products } = await (await listProducts(Object.keys(items))).json()

const minus = (container, stripeProductId) => {
	const currentVal =
		parseInt($('#purchase-quantity', container).value) || 1
	$('#purchase-quantity', container).value =
		Math.max(1, currentVal - 1)
	cart.addItem(stripeProductId, $('#purchase-quantity', container).value)
	calculateSubtotal()
}

const plus = (container, stripeProductId, maxQuantity) => {
	const currentVal =
		parseInt($('#purchase-quantity', container).value) || 1
	$('#purchase-quantity', container).value =
		Math.min(maxQuantity, currentVal + 1)
	cart.addItem(stripeProductId, $('#purchase-quantity', container).value)
	calculateSubtotal()
}

const changeQuantity = (target, stripeProductId, maxQuantity) => {
	const currentVal = parseInt(target.value) || 1
	target.value = currentVal < 1
		? 1
		: Math.min(maxQuantity, currentVal)
	cart.addItem(stripeProductId, target.value)
	calculateSubtotal()
}

const removeItem = (container, stripeProductId) => {
	container.remove()
	cart.removeItem(stripeProductId)
	calculateSubtotal()

	if (Object.keys(cart.getItems()).length > 0) return

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
		e('div', { class: 'item', stripeProductId }, [
			e('a',
				{
					href: `/product.html?stripeProductIds=["${stripeProductId}"]`
				},
				[
					e('img', {
						class: 'item-image',
						src: image,
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

const calculateSubtotal = () => {
	const cartItems = Object.entries(cart.getItems())
	const subtotal = cartItems.map(([
		stripeProductId,
		quantity,
	]) => {
		const price = products
			.find( p => p.id == stripeProductId)
			.default_price.unit_amount / 100

		return price * quantity
	})
	.reduce((x, y) => x + y, 0)

	$('#subtotal').textContent = '$' + subtotal.toFixed(2)
	$('#checkout').classList.add('disabled')
	$('#checkout').textContent = 'Cart is Empty'
}

$('#checkout').onclick = async () => {
	const cartItems = cart.getItems()
	const stripeLineItems = products
		.map(product => cartItems[product.id] && ({
			price: product.default_price.id,
			quantity: cartItems[product.id],
		}))
		.filter(l => l)
	const response = await checkout(stripeLineItems)
	const { checkoutUrl } = await response.json()

	if (response.status != 200) {
		alert('Something went wrong. Please try again.')
		return
	}

	location.href = checkoutUrl
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

calculateSubtotal()

if (Object.keys(items).length == 0) {
	$('#cart-items').textContent = 'There are no items in your cart!'
	$('#checkout').classList.add('disabled')
	$('#checkout').textContent = 'Cart is Empty'
}
