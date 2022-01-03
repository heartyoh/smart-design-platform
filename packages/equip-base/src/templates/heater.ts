const icon = new URL('../../icons/icon-heater.png', import.meta.url).href

export default {
  type: 'heater',
  description: 'heater',
  group: 'common',
  icon,
  model: {
    type: 'heater',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equip-base/common/heater.md'
}
