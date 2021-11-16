export function notify(level, message, ex) {
  document.dispatchEvent(
    new CustomEvent('notify', {
      detail: {
        level,
        message,
        ex
      }
    })
  )
}
