import { $, e } from './common.js'
import { listProducts } from './api.js'
import cart from './cart.js'

const queryParams = new URLSearchParams(location.href.split('?')[1])
const stripeProductId = JSON.parse(queryParams.get('stripeProductIds'))[0]

const {
	images,
	name,
	default_price: { unit_amount },
	quantity,
	description,
} = (await (await listProducts([stripeProductId])).json()).products[0]

let imgIdx = 0

$('#current-image').onerror = e => {
	e.target.src = '/img/placeholder.png'
}

$('#prev-image').onclick = () => {
	imgIdx = imgIdx == 0
		? images.length - 1
		: imgIdx - 1
	$('#current-image').src = images[imgIdx]
}

$('#next-image').onclick = () => {
	imgIdx = (imgIdx + 1) % images.length
	$('#current-image').src = images[imgIdx]
}

$('#minus').onclick = () => {
	const currentVal = parseInt($('#purchase-quantity').value) || 1
	$('#purchase-quantity').value = Math.max(1, currentVal - 1)
}

$('#plus').onclick = () => {
	const currentVal = parseInt($('#purchase-quantity').value) || 1
	$('#purchase-quantity').value = Math.min(quantity, currentVal + 1)
}

$('#purchase-quantity').onchange = () => {
	const currentVal = parseInt($('#purchase-quantity').value) || 1
	$('#purchase-quantity').value = currentVal < 1
		? 1
		: Math.min(quantity, currentVal)
}

$('#add-to-cart').onclick = () => {
	cart.addItem(
		stripeProductId,
		$('#purchase-quantity').value,
	)

	$('#added-to-cart').classList.add('show')
}

if (cart.getItems()[stripeProductId]) {
	$('#added-to-cart').classList.add('show')
}

$('title').textContent = `Stitch Cafe - ${name}`
$('#current-image').src = images[imgIdx]
$('#product-name').textContent = name
$('#price').textContent = '$' + parseFloat(unit_amount / 100).toFixed(2)
$('#remaining-quantity').textContent = `(${quantity} left)`
$('#description').textContent = description
$('#purchase-quantity').value = cart.getItems()[stripeProductId] || 1

if (quantity == 0) {
	$('.quantity-container').remove()
	$('#add-to-cart').classList.add('out-of-stock')
	$('#add-to-cart').textContent = 'Out of stock'
}
