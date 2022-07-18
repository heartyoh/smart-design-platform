const icon = new URL('../../icons/icon-combuster03.png', import.meta.url).href

export default {
  type: 'combuster-nozzle-mix',
  description: 'combuster-nozzle-mix',
  group: 'combuster',
  icon,
  model: {
    type: 'combuster-nozzle-mix',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/combuster/combuster-nozzle-mix.md'
}
