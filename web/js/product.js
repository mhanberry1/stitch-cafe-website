import { $, e } from './common.js'
import { listProducts } from './api.js'

const queryParams = new URLSearchParams(location.href.split('?')[1])
const stripeProductId = queryParams.get('stripeProductId')
const {
	images,
	name,
	default_price: { unit_amount },
	quantity,
	description,
} = (await (await listProducts(stripeProductId)).json()).products[0]

let imgIdx = 0

$('#prev-image').onclick = () => {
	imgIdx = imgIdx == 0
		? images.length - 1
		: imgIdx - 1
	$('#current-image').href = images[imgIdx]
}

$('#next-image').onclick = () => {
	imgIdx = (imgIdx + 1) % images.length
	$('#current-image').href = images[imgIdx]
}

$('#current-image').href = images[imgIdx]
$('#product-name').textContent = name
$('#price').textContent = '$' + parseFloat(unit_amount / 100).toFixed(2)
$('#remaining-quantity').textContent = `(${quantity} left)`
$('#description').textContent = description
