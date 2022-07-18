const icon = new URL('../../icons/icon-combuster02.png', import.meta.url).href

export default {
  type: 'combuster-in-boiler',
  description: 'combuster-in-boiler',
  group: 'combuster',
  icon,
  model: {
    type: 'combuster-in-boiler',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/combuster/combuster-in-boiler.md'
}
