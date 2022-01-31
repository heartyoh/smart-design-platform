export default function route(page: string) {
  switch (page) {
    case 'evaluator-home':
      import('./pages/evaluator-home')
      return page
  }
}
