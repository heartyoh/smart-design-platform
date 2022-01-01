import './things-scene-components.import'
import '@operato/board/ox-board-modeller.js'

import gql from 'graphql-tag'
import { css, html } from 'lit'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { BoardModeller } from '@operato/board/ox-board-modeller.js'
import { OxPropertyEditor } from '@operato/property-editor'
import { client, gqlContext, PageView, store } from '@things-factory/shell'

import { provider } from '../board-provider'
import components from './things-scene-components-with-tools.import'

const NOOP = () => {}

export class ProcessModellerPage extends connect(store)(PageView) {
  constructor() {
    super()

    components.forEach(component => {
      BoardModeller.registerTemplate(component.templates)
    })

    /* 컴포넌트에서 정의된 에디터들을 MODELLER_EDITORS에 등록 */
    var addedEditors = {}
    for (let component in components) {
      let { editors } = components[component]

      editors &&
        editors.forEach(editor => {
          let { type, element } = editor

          addedEditors[type] = element
        })
    }

    OxPropertyEditor.register(addedEditors)

    this.boardName = ''
    this.model = {
      width: 1920,
      height: 1080
    }
    this.baseUrl = ''
    this.selected = []
    this.mode = 1
    this.hideProperty = false
    this.overlay = null
    this.scene = null
    this.fonts = []
    this.board = null
    this.componentGroupList = BoardModeller.groups
  }

  static get properties() {
    return {
      boardId: String,
      boardName: String,
      model: Object,
      baseUrl: String,
      selected: Array,
      mode: Number,
      hideProperty: Boolean,
      overlay: String,
      scene: Object,
      componentGroupList: Array,
      fonts: Array,
      _showSpinner: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
          position: relative;
        }

        board-modeller {
          flex: 1;
        }

        oops-spinner {
          display: none;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        oops-spinner[show] {
          display: block;
        }

        oops-note {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `
    ]
  }

  get context() {
    return {
      title: this.board ? this.boardName : this._showSpinner ? 'Fetching process...' : 'Process Not Found',
      help: 'process-modeller/modeller',
      widebleed: true
    }
  }

  get oopsNote() {
    return {
      icon: 'color_lens',
      title: 'EMPTY PROCESS',
      description: 'There are no process to be designed'
    }
  }

  get modeller() {
    return this.renderRoot.querySelector('process-modeller')
  }

  async refresh() {
    if (!this.boardId) {
      this.board = null
      this.model = {
        width: 1920,
        height: 1080
      }

      return
    }
    try {
      this._showSpinner = true
      this.updateContext()

      var response = await client.query({
        query: gql`
          query FetchBoardById($id: String!) {
            board(id: $id) {
              id
              name
              model
            }
          }
        `,
        variables: { id: this.boardId },
        context: gqlContext()
      })

      var board = response.data.board

      if (!board) {
        this._board = null
        throw 'process not found'
      }

      this.board = {
        ...board,
        model: JSON.parse(board.model)
      }

      this.boardName = this.board.name
      this.model = {
        ...this.board.model
      }
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex
          }
        })
      )
    } finally {
      this._showSpinner = false
      this.updateContext()
    }
  }

  updated(changes) {
    if (changes.has('boardId')) {
      this.refresh()
    }
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this.boardId = lifecycle.resourceId
    } else {
      this.boardId = null
      this.model = {
        width: 1280,
        height: 1020,
        components: []
      }
      this.modeller?.close()
    }
  }

  stateChanged(state) {
    this.baseUrl = state.route.rootPath
    this.fonts = state.font
  }

  render() {
    var oops = !this._showSpinner && !this.model && this.oopsNote

    return oops
      ? html`
          <oops-note
            icon=${oops.icon}
            title=${oops.title}
            description=${oops.description}
            @click=${oops.click || NOOP}
          ></oops-note>
        `
      : html`
          <ox-board-modeller
            .mode=${this.mode}
            @mode-changed=${e => {
              this.mode = e.detail.value
            }}
            .model=${this.model}
            @model-changed=${e => {
              this.model = e.detail.value
            }}
            .scene=${this.scene}
            @scene-changed=${e => {
              this.scene = e.detail.value
            }}
            .selected=${this.selected}
            @selected-changed=${e => {
              this.selected = e.detail.value
            }}
            .baseUrl=${this.baseUrl}
            .provider=${provider}
            @save-model=${e => this.saveBoard()}
            .componentGroupList=${this.componentGroupList}
            .fonts=${this.fonts}
            .hideProperty=${this.hideProperty}
          >
          </ox-board-modeller>
          <oops-spinner ?show=${this._showSpinner}></oops-spinner>
        `

    return html``
  }

  async updateBoard() {
    try {
      this._showSpinner = true

      var { id, name, description, groupId } = this.board
      var model = JSON.stringify(this.scene.model)

      await client.mutate({
        mutation: gql`
          mutation UpdateBoard($id: String!, $patch: BoardPatch!) {
            updateBoard(id: $id, patch: $patch) {
              id
            }
          }
        `,
        variables: {
          id,
          patch: { name, description, model, groupId }
        },
        context: gqlContext()
      })

      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'info',
            message: 'saved'
          }
        })
      )
    } catch (ex) {
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: {
            level: 'error',
            message: ex,
            ex: ex
          }
        })
      )
    } finally {
      this._showSpinner = false
    }

    this.updateContext()
  }

  async saveBoard() {
    await this.updateBoard()
  }
}

customElements.define('process-modeller-page', ProcessModellerPage)
