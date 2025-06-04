export const h = (
  tag: string,
  attrs?: Record<string, string | number | undefined>,
  children?: (Element | string | false | undefined)[],
) => {
  const el = document.createElement(tag)

  for (const [key, value] of attrs ? Object.entries(attrs) : []) {
    if (value === undefined) continue

    if (key === 'class') {
      el.className = value.toString()
    } else {
      el.setAttribute(key, value.toString())
    }
  }

  children?.forEach((child) => {
    if (typeof child === 'string') {
      el.textContent = child
    } else if (child) {
      el.appendChild(child)
    }
  })

  return el
}
