const icon = new URL('../../icons/icon-pump.png', import.meta.url).href

export default {
  type: 'pump',
  description: 'pump',
  group: 'pump',
  icon,
  model: {
    type: 'pump',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/board-modeller/effects/shadow.md'
}
