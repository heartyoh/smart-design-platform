import bootstrap from './client/bootstrap'
import route from './client/route'

export default {
  route,
  routes: [
    {
      tagname: 'process-viewer-page',
      page: 'process-viewer'
    },
    {
      tagname: 'process-modeller-page',
      page: 'process-modeller-page'
    }
  ],
  bootstrap
}
