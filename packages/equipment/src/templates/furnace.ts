const icon = new URL('../../icons/icon-furnace.png', import.meta.url).href

export default {
  type: 'furnace',
  description: 'furnace',
  group: 'furnace',
  icon,
  model: {
    type: 'furnace',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/furnace/furnace.md'
}
