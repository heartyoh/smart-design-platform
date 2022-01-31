const icon = new URL('../../icons/icon-burner.png', import.meta.url).href

export default {
  type: 'burner',
  description: 'burner',
  group: 'burner',
  icon,
  model: {
    type: 'burner',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    fillStyle: '#08347f'
  },
  about: '/helps/equipment/burner/burner.md'
}
