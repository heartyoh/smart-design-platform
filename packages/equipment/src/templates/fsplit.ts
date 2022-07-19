const icon = new URL('../../icons/icon-fsplit.png', import.meta.url).href

export default {
  type: 'fsplit',
  description: 'fsplit',
  group: 'common',
  icon,
  model: {
    type: 'fsplit',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/common/fsplit.md'
}
