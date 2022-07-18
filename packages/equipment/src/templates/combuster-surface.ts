const icon = new URL('../../icons/icon-combuster07.png', import.meta.url).href

export default {
  type: 'combuster-surface',
  description: 'combuster-surface',
  group: 'combuster',
  icon,
  model: {
    type: 'combuster-surface',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/combuster/combuster-surface.md'
}
