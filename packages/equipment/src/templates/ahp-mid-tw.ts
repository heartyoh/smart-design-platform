const icon = new URL('../../icons/icon-hpump.png', import.meta.url).href

export default {
  type: 'ahp-mid-tw',
  description: 'Single effect hot water driven absorption chiller',
  group: 'pump',
  icon,
  model: {
    type: 'ahp-mid-tw',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/ahp/ahp-mid-tw.md'
}
