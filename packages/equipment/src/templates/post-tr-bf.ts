const icon = new URL('../../icons/icon-post-tr.png', import.meta.url).href

export default {
  type: 'post-tr-bf',
  description: 'Cyclone',
  group: 'post-tr',
  icon,
  model: {
    type: 'post-tr-bf',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/post-tr/post-tr-bf.md'
}
