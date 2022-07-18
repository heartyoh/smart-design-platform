const icon = new URL('../../icons/icon-combuster01.png', import.meta.url).href

export default {
  type: 'combuster-hot-air',
  description: 'combuster hot air',
  group: 'combuster',
  icon,
  model: {
    type: 'combuster-hot-air',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/combuster/combuster-hot-air.md'
}
