const icon = new URL('../../icons/icon-dryer.png', import.meta.url).href

export default {
  type: 'dryer-rotary',
  description: 'rotary dryer',
  group: 'dryer',
  icon,
  model: {
    type: 'dryer-rotary',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/dryer/dryer-rotary.md'
}
