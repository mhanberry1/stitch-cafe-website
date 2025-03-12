export const $ = (query, target = document) => target.querySelector(query)

export const $$ = (query, target = document) => target.querySelectorAll(query)

export const e = (elementType, attributes = {}, children = []) => {
	const events = [
		'onerror', 'onload', 'onchange', 'onclick',
		'onmouseover', 'onmouseout', 'onkeydown',
	]
	const element = document.createElement(elementType)

	Object.entries(attributes).forEach(([key, val]) =>
		events.includes(key)
			? element[key] = val
			: element.setAttribute(key, val)
	)

	children.forEach(child => {
		if (typeof(child) == 'string') {
			element.innerHTML += child
		} else {
			element.append(child)
		}
	})

	return element
}
