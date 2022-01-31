const icon = new URL('../../icons/icon-plc.png', import.meta.url).href

export default {
  type: 'plc',
  description: 'plc',
  group: 'common',
  icon,
  model: {
    type: 'plc',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/common/plc.md'
}
