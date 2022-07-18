const icon = new URL('../../icons/icon-hpump.png', import.meta.url).href

export default {
  type: 'vchp',
  description: 'Vapor compression heat pump',
  group: 'pump',
  icon,
  model: {
    type: 'vchp',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/vchp/vchp.md'
}
