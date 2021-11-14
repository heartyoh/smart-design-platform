export default function route(page) {
  switch (page) {
    case '':
      return '/process-list'

    case 'process-list':
      import('./pages/process-list-page')
      return page

    case 'process-modeller':
      import('./pages/process-modeller-page')
      return page
  }
}
