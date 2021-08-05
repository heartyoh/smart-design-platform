export default function route(page) {
  switch (page) {
    case '':
      return '/designer-main'

    case 'designer-main':
      import('./pages/main')
      return page
  }
}
