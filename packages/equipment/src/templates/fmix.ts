const icon = new URL('../../icons/icon-fmix.png', import.meta.url).href

export default {
  type: 'fmix',
  description: 'fmix',
  group: 'common',
  icon,
  model: {
    type: 'fmix',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/common/fmix.md'
}
