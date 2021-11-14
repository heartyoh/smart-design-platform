export function convert(element) {
  switch (element.tagName) {
    case 'THINGS-EDITOR-ANGLE-INPUT':
      return Number(element.radian) || 0

    case 'INPUT':
      switch (element.type) {
        case 'checkbox':
          return element.checked
        case 'number':
          return Number(element.value) || 0
        case 'text':
          return String(element.value)
      }
      break

    case 'PAPER-BUTTON':
      return element.active

    case 'PAPER-LISTBOX':
      return element.selected

    default:
      return element.value
  }
}
