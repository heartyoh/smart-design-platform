import '@operato/board/ox-board-viewer.js'
import './things-scene-components.import'

import gql from 'graphql-tag'
import { css, html } from 'lit'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { client, gqlContext } from '@operato/graphql'
import { PageView, store } from '@operato/shell'

import { provider } from '../board-provider'

const NOOP = () => {}

export class ProcessViewerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _board: Object,
      _boardId: String,
      _baseUrl: String,
      _showSpinner: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          width: 100%; /* 전체화면보기를 위해서 필요함. */
          height: 100%;

          overflow: hidden;
          position: relative;
        }

        ox-board-viewer {
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

  get oopsNote() {
    return {
      icon: 'insert_chart_outlined',
      title: 'EMPTY BOARD',
      description: 'There are no board to be shown'
    }
  }

  get context() {
    return {
      /* can set the page title with the 'title' parameter. */
      title:
        this.lifecycle.params['title'] ||
        (this._board ? this._board.name : this._showSpinner ? 'Fetching process...' : 'Process Not Found')
    }
  }

  render() {
    var oops = !this._showSpinner && !this._board && this.oopsNote

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
          <ox-board-viewer .board=${this._board} .provider=${provider}></ox-board-viewer>
          <oops-spinner ?show=${this._showSpinner}></oops-spinner>
        `
  }

  updated(changes) {
    if (changes.has('_boardId')) {
      var boardViewerElement = this.renderRoot.querySelector('ox-board-viewer')
      boardViewerElement && boardViewerElement.closeScene()
      this.refresh()
    }
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this._boardId = lifecycle.resourceId
    } else {
      this._boardId = null
      let boardViewer = this.renderRoot.querySelector('ox-board-viewer')
      boardViewer && boardViewer.closeScene()
    }
  }

  stateChanged(state) {
    this._baseUrl = state.app.baseUrl
  }

  async refresh() {
    if (!this._boardId) {
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
        variables: { id: this._boardId },
        context: gqlContext()
      })

      var board = response.data.board

      if (!board) {
        this._board = null
        throw 'process not found'
      }

      this._board = {
        ...board,
        model: JSON.parse(board.model)
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
}

customElements.define('board-viewer-page', ProcessViewerPage)
