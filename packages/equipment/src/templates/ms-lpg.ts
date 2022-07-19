const icon = new URL('../../icons/icon-ms-lpg.png', import.meta.url).href

export default {
  type: 'ms-lpg',
  description: 'ms-lpg',
  group: 'common',
  icon,
  model: {
    type: 'ms-lpg',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/common/ms-lpg.md'
}
