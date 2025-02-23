import { $, e } from './common.js'
import {
	listProducts,
	createProducts,
	updateProducts,
	deleteProducts,
} from './api.js'

const { products } = await (await listProducts()).json()

const renderProduct = ({
	stripeProductId,
	images,
	name,
	default_price: { unit_amount },
	quantity,
	description,
}) => $('#product-list').append(
	e('a', {
		href: `/product.html?stripeProductIds=${JSON.stringify([stripeProductId])}`
	}, [
		e('div', { class: 'product' }, [
			e('img', { href: images[0] }),
			e('h2', {}, [ name ]),
			e('div', { class: 'row' }, [
				e('span', { class: 'price' }, [
					'$' + parseFloat(unit_amount / 100).toFixed(2),
				]),
				e('span', { class: 'quantity' }, [ `(${quantity} left)` ]),
			]),
			e('p', {}, [
				description.length > 50
					? description.slice(0, 50) + '...'
					: description
			]),
		]),
	])
)

$('#add-new-product').onclick = () =>
	$('#new-product-form').classList.toggle('show')

$('#new-product-form').onsubmit = async e => {
	const name = $('#name').value
	const price = $('#price').value
	const quantity = $('#quantity').value
	const description = $('#description').value

	e.preventDefault()

	const response = await createProducts([{
		quantity: quantity,
		stripeArgs: {
			name,
			description,
			default_price_data: {
				currency: 'usd',
				unit_amount: Math.floor(
					parseFloat(price.replace('$', '')) * 100
				),
			},
		},
	}])
	const { message } = await response.json()

	if (response.status != 200)
		return alert(`Error! The product was not created. ${message}`)

	location.reload()
}

if (localStorage.getItem('isAdmin')) {
	$('body').classList.add('admin-view')
}

products.forEach(product => renderProduct(product))
