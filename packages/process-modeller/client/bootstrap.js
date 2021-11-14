import './board-modeller/editors/board-editor-property'

import { registerEditor, registerRenderer } from '@things-factory/grist-ui'

import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'
import { BoardEditor } from './data-grist/board-editor'
import { BoardRenderer } from './data-grist/board-renderer'
import board from './reducers/board'
import { store } from '@things-factory/shell'

export default function bootstrap() {
  registerRenderer('board', BoardRenderer)
  registerEditor('board', BoardEditor)

  store.addReducers({ board })

  store.dispatch({
    type: ADD_MODELLER_EDITORS,
    editors: {
      'process-selector': 'property-editor-process-selector'
    }
  })
}
