const icon = new URL('../../icons/icon-hx.png', import.meta.url).href

export default {
  type: 'hx-st',
  description: 'heat exchanger shell and tube',
  group: 'hx',
  icon,
  model: {
    type: 'hx-st',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/hx/hx.md'
}
