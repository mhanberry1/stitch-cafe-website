export const $ = (query, target = document) => target.querySelector(query)

export const $$ = (query, target = document) => target.querySelectorAll(query)

export const e = (elementType, attributes = {}, children = []) => {
	const element = document.createElement(elementType)

	Object.entries(attributes).forEach(
		([key, val]) => element.setAttribute(key, val)
	)

	children.forEach(
		child => element.append(child)
	)

	return element
}
