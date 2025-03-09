import { $, e } from './common.js'
import {
	listProducts,
	createProducts,
	updateProducts,
	deleteProducts,
	uploadFiles,
} from './api.js'

const isAdmin = localStorage.getItem('isAdmin')
const { products } = await (await listProducts()).json()

const editProduct = (e, stripeProductId) => {
	e.stopPropagation()
	location = '/product.html'
		+ `?stripeProductIds=["${stripeProductId}"]`
		+ '&edit=true'
}

const deleteProduct = async (e, stripeProductId) => {
	e.stopPropagation()
	await deleteProducts([stripeProductId])
	location.reload()
}

const renderProduct = ({
	stripeProductId,
	images,
	name,
	default_price: { unit_amount },
	quantity,
	description,
}) => $('#product-list').append(
	e('div', {
		class: 'product',
		onclick: () => location = '/product.html'
			+ `?stripeProductIds=["${stripeProductId}"]`
	}, [
		e('div', {
			class: `admin-buttons ${isAdmin ? 'show' : ''}`
		}, [
			e ('span', { class: 'admin-button' }, [
				e('img', {
					src: '/img/edit.svg',
					onclick: e => editProduct(e, stripeProductId),
				}),
			]),
			e ('span', { class: 'admin-button' }, [
				e('img', {
					src: '/img/delete.svg',
					onclick: e => deleteProduct(e, stripeProductId),
				}),
			]),
		]),
		e('img', {
			class: 'product-image',
			src: images[0],
			onerror: e => {
				e.target.src = '/img/placeholder.png'
			}
		}),
		e('h2', {}, [ name ]),
		e('span', { class: 'price' }, [
			'$' + parseFloat(unit_amount / 100).toFixed(2),
		]),
		e('p', {}, [
			description.length > 50
				? description.slice(0, 50) + '...'
				: description
		]),
	]),
)

$('#add-new-product').onclick = () =>
	$('#new-product-form').classList.toggle('show')

$('#new-product-form').onsubmit = async e => {
	const name = $('#name').value
	const price = $('#price').value
	const quantity = $('#quantity').value
	const description = $('#description').value
	const files = $('#images').files

	e.preventDefault()

	// Upload images
	const { uploadedFiles } = await (await uploadFiles(files)).json()

	// Create products
	const response = await createProducts([{
		quantity: quantity,
		stripeArgs: {
			name,
			description,
			images: uploadedFiles,
			default_price_data: {
				currency: 'usd',
				unit_amount: Math.floor(
					parseFloat(price.replace('$', '')) * 100
				),
			},
			metadata: {
				type: 'class',
			}
		},
	}])
	const { message } = await response.json()

	if (response.status != 200)
		return alert(`Error! The product was not created. ${message}`)

	location.reload()
}

products
	.filter(product => product.metadata.type == 'class')
	.forEach(product => renderProduct(product))

if (isAdmin) {
	$('body').classList.add('admin-view')
}
