const icon = new URL('../../icons/icon-blower.png', import.meta.url).href

export default {
  type: 'blower',
  description: 'blower',
  group: 'common',
  icon,
  model: {
    type: 'blower',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/common/blower.md'
}
