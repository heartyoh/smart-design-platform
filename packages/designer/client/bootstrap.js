import { store } from '@things-factory/shell'
import designer from './reducers/main'

export default function bootstrap() {
  store.addReducers({
    designer
  })
}
