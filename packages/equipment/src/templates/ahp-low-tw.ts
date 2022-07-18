const icon = new URL('../../icons/icon-hpump.png', import.meta.url).href

export default {
  type: 'ahp-low-tw',
  description: 'Two-stage hot water driven absorption Chiller',
  group: 'pump',
  icon,
  model: {
    type: 'ahp-low-tw',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/ahp/ahp-low-tw.md'
}
