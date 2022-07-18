const icon = new URL('../../icons/icon-combuster02.png', import.meta.url).href

export default {
  type: 'combuster-in-boiler-hvol',
  description: 'combuster-in-boiler-hvol',
  group: 'combuster',
  icon,
  model: {
    type: 'combuster-in-boiler-hvol',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/combuster/combuster-in-boiler-hvol.md'
}
