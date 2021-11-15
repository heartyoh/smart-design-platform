import bootstrap from './client/bootstrap'
import route from './client/route'

export default {
  route,
  routes: [
    {
      tagname: 'process-list',
      page: 'process-list'
    }
  ],
  bootstrap
}
