const icon = new URL('../../icons/icon-hpump.png', import.meta.url).href

export default {
  type: 'hpump',
  description: 'hpump',
  group: 'pump',
  icon,
  model: {
    type: 'hpump',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/board-modeller/effects/shadow.md'
}
