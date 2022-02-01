import '@material/mwc-icon'
import '@operato/data-grist/ox-grist.js'
import '@operato/data-grist/ox-sorters-control.js'
import '@operato/data-grist/ox-filters-form.js'
import '@operato/input/ox-select.js'
import '@operato/popup/ox-popup-list.js'
import '@smart-design-platform/process-modeller'
import '../viewparts/board-info'
import '../viewparts/process-report'

import { html } from 'lit'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { i18next } from '@operato/i18n'
import { openOverlay, openPopup } from '@operato/layout'
import { navigate, PageView, store } from '@operato/shell'
import { CommonGristStyles } from '@operato/styles'
import { sleep } from '@operato/utils'
import InfiniteScrollable from '@operato/utils/mixins/infinite-scrollable.js'

import {
  createBoard,
  deleteBoard,
  fetchBoardList,
  fetchFavoriteBoardList,
  fetchGroupList,
  updateBoard
} from '../graphql'
import { notify } from '../utils/notify'

class ProcessListPage extends connect(store)(InfiniteScrollable(PageView)) {
  static get styles() {
    return [
      CommonGristStyles,
      css`
        :host {
          display: flex;

          width: 100%;

          --grid-record-emphasized-background-color: red;
          --grid-record-emphasized-color: yellow;
        }
      `
    ]
  }

  static get properties() {
    return {
      config: Object,
      data: Object,
      mode: String,
      groupId: String,
      groups: Array,
      favorites: Array
    }
  }

  get context() {
    return {
      title: '전체 공정 리스트'
    }
  }

  get grist() {
    return this.renderRoot.querySelector('ox-grist')
  }

  render() {
    const mode = this.mode || 'CARD'
    const groups = this.groups || []

    return html`
      <ox-grist .config=${this.config} .mode=${mode} auto-fetch .fetchHandler=${this.fetchHandler.bind(this)}>
        <div slot="headroom" id="headroom">
          <div id="filters">
            <ox-filters-form> </ox-filters-form>

            <ox-select
              placeholder="${i18next.t('text.select-group')}"
              @change=${e => {
                this.groupId = e.currentTarget.value
              }}
            >
              <ox-popup-list>
                <div option value="">&nbsp;</div>
                <div option value="favor">favorite</div>
                ${groups.map(
                  group =>
                    html`
                      <div option value=${group.id} ?selected=${group.id === this.groupId}>${group.description}</div>
                    `
                )}
              </ox-popup-list>
            </ox-select>
          </div>

          <div id="sorters">
            <mwc-icon
              @click=${e => {
                const target = e.currentTarget
                this.renderRoot.querySelector('#sorter-control').open({
                  right: 0,
                  top: target.offsetTop + target.offsetHeight
                })
              }}
              >sort</mwc-icon
            >
            <ox-popup id="sorter-control">
              <ox-sorters-control> </ox-sorters-control>
            </ox-popup>
          </div>

          <div id="modes">
            <mwc-icon @click=${() => (this.mode = 'GRID')} ?active=${mode == 'GRID'}>grid_on</mwc-icon>
            <mwc-icon @click=${() => (this.mode = 'LIST')} ?active=${mode == 'LIST'}>format_list_bulleted</mwc-icon>
            <mwc-icon @click=${() => (this.mode = 'CARD')} ?active=${mode == 'CARD'}>apps</mwc-icon>
          </div>

          <div id="add">
            <button><mwc-icon @click=${e => this.onCreateBoard()}>add</mwc-icon></button>
          </div>
        </div>
      </ox-grist>
    `
  }

  async fetchHandler() {
    const { items: records, total } = await this.getBoards(...arguments)

    return {
      total,
      records
    }
  }

  get gristConfig() {
    const images = [
      `/assets/images/sample-thumb1.png`,
      `/assets/images/sample-thumb2.png`,
      `/assets/images/sample-thumb3.png`
    ]

    return {
      list: {
        thumbnail: 'thumbnail',
        fields: ['name', 'description'],
        details: ['updatedAt']
      },
      columns: [
        {
          type: 'gutter',
          gutterName: 'dirty'
        },
        {
          type: 'gutter',
          gutterName: 'sequence'
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'star_border',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              this.onShowReport(record.id)
            }
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'drive_file_rename_outline',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              this.onInfoBoard(record.id)
            }
          }
        },
        {
          type: 'string',
          name: 'id',
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: 'name',
          record: {
            editable: true,
            align: 'left'
          },
          width: 200,
          filter: 'search',
          sortable: true
        },
        {
          type: 'string',
          name: 'description',
          header: 'description',
          record: {
            editable: true,
            align: 'left'
          },
          width: 200,
          handlers: {
            dblclick: (columns, data, column, record, rowIndex) => {
              alert(`${column.name} ${record[column.name]}, row : ${rowIndex}`)
            }
          },
          filter: 'search'
        },
        {
          type: 'image',
          name: 'thumbnail',
          hidden: true,
          record: {
            editable: false,
            renderer: function (value, column, record, rowIndex, owner) {
              return html` <img src=${images[rowIndex % 3]} style="width: 100%; height: 100%;" /> `
            }
          }
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: 'updated at',
          record: {
            editable: true
          },
          sortable: true,
          width: 180
        },
        {
          type: 'datetime',
          name: 'createdAt',
          header: 'created at',
          record: {
            editable: true
          },
          width: 180
        }
      ],
      rows: {
        selectable: {
          multiple: true
        },
        handlers: {
          click: 'select-row-toggle'
        },
        classifier: function (record, rowIndex) {}
      },
      sorters: [
        {
          name: 'name',
          desc: false
        }
      ],
      pagination: {
        pages: [20, 30, 50, 100, 200]
      }
    }
  }

  updated(changes) {
    if (changes.has('groupId')) {
      this.refresh()
    }
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this.grist.fetch()
    }
  }

  pageInitialized() {
    this.config = this.gristConfig

    this.page = 1
    this.limit = 50

    this.refresh()
  }

  async onInfoBoard(boardId) {
    openOverlay('viewpart-info', {
      template: html`
        <board-info
          .boardId=${boardId}
          .groupId=${this.groupId}
          @update-board=${e => this.onUpdateBoard(e.detail)}
          @delete-board=${e => this.onDeleteBoard(e.detail)}
          @join-playgroup=${e => this.onJoinPlayGroup(e.detail)}
          @leave-playgroup=${e => this.onLeavePlayGroup(e.detail)}
        ></board-info>
      `
    })
  }

  async onShowReport(boardId) {
    /*
     * 기존 설정된 이미지가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var template = html` <process-report .boardId=${boardId}></process-report> `

    openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.process-report')
    })
  }

  async onCreateBoard() {
    if (this.popup) {
      delete this.popup
    }

    /*
     * 기존 설정된 이미지가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var template = html`
      <process-creation-popup
        .defaultGroup=${this.defaultGroup}
        .groups=${this.groups}
        @create-process=${async e => {
          try {
            var { name, description, groupId } = e.detail
            var board = {
              name,
              description,
              groupId
            }

            if (!board.model) {
              board.model = {
                width: 800,
                height: 600
              }
            }

            const { createBoard: created } = await createBoard(board)

            this.popup && this.popup.close()

            await sleep(100)

            navigate(`process-modeller-page/${created.id}`)

            notify('info', 'new process created')
          } catch (ex) {
            console.error(ex)
            notify('error', ex, ex)
          }
        }}
      ></process-creation-popup>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.create-process')
    })
  }

  async onUpdateBoard(board) {
    try {
      await updateBoard(board)
      notify('info', 'saved')
    } catch (ex) {
      notify('error', ex, ex)
    }

    this.refreshBoards()
  }

  async onDeleteBoard(boardId) {
    try {
      await deleteBoard(boardId)
      notify('info', 'deleted')
    } catch (ex) {
      notify('error', ex, ex)
    }

    this.refreshBoards()
  }

  async refresh() {
    this.groups = (await fetchGroupList()).groups.items

    if (this.groups) {
      await this.refreshBoards()
    }
  }

  async getBoards({ filters = [], page = 1, limit = 30, sortings = [] } = {}) {
    if (this.groupId && this.groupId == 'favor') {
      return await this.getFavoriteBoards(...arguments)
    }

    return (
      await fetchBoardList({
        filters: this.groupId
          ? [
              ...filters,
              {
                name: 'group_id',
                operator: 'eq',
                value: this.groupId
              }
            ]
          : filters,
        sortings,
        pagination: {
          page,
          limit
        }
      })
    ).boards
  }

  async getFavoriteBoards({ filters = [], page = 1, limit = 30, sortings = [] } = {}) {
    return (
      await fetchFavoriteBoardList({
        filters,
        pagination: {
          page,
          limit
        },
        sortings
      })
    ).favoriteBoards
  }

  async refreshBoards() {
    if (!this.groups) {
      await this.refresh()
      return
    }

    this.grist.fetch()

    this.updateContext()
  }
}

window.customElements.define('process-list', ProcessListPage)
