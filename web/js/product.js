import { $, e } from './common.js'
import {
	listProducts,
	uploadFiles,
	updateProducts,
} from './api.js'
import cart from './cart.js'

const isAdmin = localStorage.getItem('isAdmin')
const queryParams = new URLSearchParams(location.href.split('?')[1])
const stripeProductId = JSON.parse(queryParams.get('stripeProductIds'))[0]
const cachedInfo = JSON.parse(localStorage.getItem('products') || '[]')
	.find(product => product.id == stripeProductId)

// Render cached info at first
if (cachedInfo) {
	const {
		images,
		name,
		default_price: { unit_amount },
		description,
	} = cachedInfo

	$('title').textContent = `Stitch Cafe - ${name}`
	$('#current-image').src = images[0]
	$('#product-name').textContent = name
	$('#price').textContent = '$' + parseFloat(unit_amount / 100).toFixed(2)
	$('#description').innerHTML = description
	$('#purchase-quantity').value = cart.getItems()[stripeProductId] || 1
}

const {
	images,
	name,
	default_price: { unit_amount },
	quantity,
	description,
	metadata: { category },
} = (await (await listProducts([stripeProductId])).json()).products[0]

let imgIdx = 0

$('#current-image').onerror = e => {
	e.target.src = '/img/placeholder.png'
}

$('#add-images').onclick = () => {
	const input = e('input', { type: 'file', multiple: true})

	input.onchange = async () => {
		const response = await uploadFiles(input.files)
		const { uploadedFiles } = await response.json()

		images.splice(imgIdx, 0, ...uploadedFiles)
		$('#current-image').src = images[imgIdx]

		if (images.length < 2) return

		$('#image-controls').classList.remove('hidden')
	}

	input.click()
}

$('#edit-image').onclick = () => {
	const input = e('input', { type: 'file' })

	input.onchange = async () => {
		const response = await uploadFiles(input.files)
		images[imgIdx] = (await response.json()).uploadedFiles[0]

		$('#current-image').src = images[imgIdx]
	}

	input.click()
}

$('#delete-image').onclick = () => {
	images.splice(imgIdx, 1)
	imgIdx = Math.min(imgIdx, images.length - 1)
	$('#current-image').src = images[imgIdx]

	if (images.length > 1) return

	$('#image-controls').classList.add('hidden')
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

$('#update-product').onclick = async () => {
	const response = await updateProducts([{
		stripeProductId,
		quantity: parseInt(
			$('#remaining-quantity').textContent.replace(/[^\d]/g, '')
		),
		price: parseFloat(
			$('#price').textContent.replace(/[^\d\.]/g, '')
		),
		stripeArgs: {
			images,
			name: $('#product-name').textContent,
			description: $('#description').innerHTML,
			metadata: {
				category: $('#edit-category').value,
			},
		},
	}])

	if (response.status != 200) {
		alert('Error! The product was not updated.')
		return
	}

	location.reload()
}

if (cart.getItems()[stripeProductId]) {
	$('#added-to-cart').classList.add('show')
}

$('title').textContent = `Stitch Cafe - ${name}`
$('#current-image').src = images[imgIdx]
$('#product-name').textContent = name
$('#price').textContent = '$' + parseFloat(unit_amount / 100).toFixed(2)
$('#remaining-quantity').textContent = `(${quantity} left)`
$('#description').innerHTML = description
$('#edit-category').value = category || ''
$('#purchase-quantity').value = cart.getItems()[stripeProductId] || 1

if (quantity == 0) {
	$('.quantity-container').remove()
	$('#add-to-cart').classList.add('out-of-stock')
	$('#add-to-cart').textContent = 'Out of stock'
}

if (images.length >= 2) {
	$('#image-controls').classList.remove('hidden')
}

if (isAdmin && queryParams.get('edit')) {
	const editable = [
		'#product-name',
		'#price',
		'#remaining-quantity',
		'#description',
	]

	editable.forEach(selector =>
		$(selector).setAttribute('contenteditable', true)
	)

	$('main').classList.add('edit')
	$('#edit-category').style.display = 'unset'
}
