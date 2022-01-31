const icon = new URL('../../icons/icon-recycle.png', import.meta.url).href

export default {
  type: 'recycle',
  description: 'recycle',
  group: 'common',
  icon,
  model: {
    type: 'recycle',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fontColor: 'red'
  },
  about: '/helps/equipment/common/recycle.md'
}
