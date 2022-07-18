const icon = new URL('../../icons/icon-hpump.png', import.meta.url).href

export default {
  type: 'ahp-direct',
  description: 'Direct fired double effect absorption chiller ',
  group: 'pump',
  icon,
  model: {
    type: 'ahp-direct',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/ahp/ahp-direct.md'
}
