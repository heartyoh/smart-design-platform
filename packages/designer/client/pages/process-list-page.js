import '@material/mwc-icon'
import '@operato/data-grist'
import '@operato/input/ox-select.js'
import '@operato/popup/ox-popup-list.js'
import '@operato/data-grist/sorters-control.js'
import '@smart-design-platform/process-modeller'
import '../viewparts/board-info'
import '../viewparts/process-report'

import { css, html } from 'lit'
import { connect } from 'pwa-helpers/connect-mixin.js'

import InfiniteScrollable from '@operato/utils/mixins/infinite-scrollable.js'
import { i18next } from '@things-factory/i18n-base'
import { openOverlay, openPopup } from '@things-factory/layout-base'
import { navigate, PageView, store } from '@things-factory/shell'
import { sleep } from '@things-factory/utils'

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
    return css`
      :host {
        display: flex;

        width: 100%;

        --grid-record-emphasized-background-color: red;
        --grid-record-emphasized-color: yellow;
      }

      ox-grist {
        flex: 1;
        overflow-y: auto;

        --grid-record-emphasized-background-color: red;
        --grid-record-emphasized-color: yellow;
      }

      #headroom {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: var(--padding-default) var(--padding-wide);
        border-top: 2px solid rgba(0, 0, 0, 0.2);
        background-color: var(--theme-white-color);
        box-shadow: var(--box-shadow);
      }

      #add {
        width: 50px;
        text-align: right;
      }

      #modes {
        margin-left: auto;
      }

      #modes > * {
        padding: var(--padding-narrow);
        font-size: 1em;
        opacity: 0.5;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      #modes > mwc-icon[active] {
        border-radius: 9px;
        background-color: rgba(var(--primary-color-rgb), 0.05);
        opacity: 1;
        color: var(--secondary-text-color);
        cursor: default;
      }

      #modes > mwc-icon:hover {
        opacity: 1;
        color: var(--secondary-text-color);
      }

      #add button {
        background-color: var(--status-success-color);
        border: 0;
        border-radius: 50%;
        padding: 5px;
        width: 36px;
        height: 36px;
        cursor: pointer;
      }
      #add button:hover {
        background-color: var(--focus-background-color);
        box-shadow: var(--box-shadow);
      }
      #add button mwc-icon {
        font-size: 2em;
        color: var(--theme-white-color);
      }

      #filters {
        display: flex;
        position: relative;
        align-items: center;
      }
      #filters [type='text'] {
        background-color: transparent;
        border: 0;
        border-bottom: var(--border-dark-color);
        padding: var(--padding-narrow) var(--padding-narrow) 7px 25px;
        font-size: var(--fontsize-large);
      }
      #filters [type='text']:focus {
        outline: none;
      }
      #filters mwc-icon {
        position: absolute;
        top: 3px;
        color: var(--secondary-color);
      }

      #filters * {
        margin-right: var(--margin-default);
      }

      #search {
        display: flex;
        position: relative;
        align-items: center;

        --mdc-icon-size: 20px;
      }

      #search [type='text'] {
        flex: 1;
        background-color: transparent;
        border: 0;
        border-bottom: var(--border-dark-color);
        padding: var(--padding-narrow) var(--padding-narrow) 7px 25px;
        font-size: var(--fontsize-large);
        outline: none;
      }

      #search mwc-icon {
        position: absolute;
        color: var(--secondary-color);
      }

      ox-select {
        border: 0;
        outline: none;
      }

      @media only screen and (max-width: 460px) {
        #modes {
          display: none;
        }
      }
    `
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
    return this.shadowRoot.querySelector('ox-grist')
  }

  render() {
    const mode = this.mode || 'CARD'
    const groups = this.groups || []

    return html`
      <ox-grist .config=${this.config} .mode=${mode} auto-fetch .fetchHandler=${this.fetchHandler.bind(this)}>
        <div slot="headroom" id="headroom">
          <div id="filters">
            <div id="search">
              <mwc-icon>search</mwc-icon>
              <input type="text" />
            </div>

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

          <div>
            <mwc-icon
              @click=${e => {
                const target = e.currentTarget
                this.renderRoot.querySelector('#sorter-control').open({
                  left: target.offsetLeft,
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

  async fetchHandler({ page, limit, sorters = [] }) {
    const { items: records, total } = await this.getBoards({ page, limit, sorters })

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
          }
        },
        {
          type: 'boolean',
          name: 'active',
          header: 'active',
          record: {
            editable: true
          },
          sortable: true,
          width: 60
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
          sortable: true,
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

  async getBoards({ page = 1, limit = 30, sorters = [] } = {}) {
    if (this.groupId && this.groupId == 'favor')
      return await this.getFavoriteBoards({
        page,
        limit
      })

    var listParam = {
      filters: this.groupId
        ? [
            {
              name: 'group_id',
              operator: 'eq',
              value: this.groupId
            }
          ]
        : [],
      sortings: sorters,
      pagination: {
        page,
        limit
      }
    }

    return (await fetchBoardList(listParam)).boards
  }

  async getFavoriteBoards({ page = 1, limit = 30 } = {}) {
    var listParam = {
      pagination: {
        page,
        limit
      }
    }

    return (await fetchFavoriteBoardList(listParam)).favoriteBoards
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
