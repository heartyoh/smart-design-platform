import '@material/mwc-icon'

export function getMenuTemplate() {
  return [
    {
      name: '공정그룹',
      type: 'group'
    },
    {
      name: '전체 공정 리스트',
      path: 'process-list',
      icon: 'apps'
    },
    {
      name: '즐겨찾기 공정',
      path: '',
      icon: 'apps'
    },
    {
      name: '공정 그룹 생성',
      path: 'process-modeller-page',
      icon: 'apps'
    }
  ]
}
