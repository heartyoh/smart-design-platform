import '@operato/popup'
import '@operato/data-grist'

import { css, html } from 'lit-element'

import { i18next, localize } from '@things-factory/i18n-base'
import { PageView } from '@things-factory/shell'

class ProcessListPage extends localize(i18next)(PageView) {
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
        flex-direction: column;
        background-color: var(--primary-color);
        height: 200px;
        align-items: center;
        justify-content: center;
        color: var(--theme-white-color);
      }

      #modes > * {
        padding: var(--padding-narrow);
        font-size: 1.5em;
        opacity: 0.7;
      }

      #modes > mwc-icon[active] {
        border: 1px solid var(--status-warning-color);
        border-radius: 9px;
        background-color: rgba(0, 0, 0, 0.3);
        opacity: 1;
      }

      #filters {
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: calc(100% - 20px);
      }
    `
  }

  static get properties() {
    return {
      config: Object,
      data: Object,
      mode: String
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

    return html`
      <ox-grist .config=${this.config} .mode=${mode} auto-fetch .fetchHandler=${this.fetchHandler}>
        <div slot="headroom" id="headroom">
          <h1>Process List Search</h1>
          <div id="modes">
            <mwc-icon @click=${() => (this.mode = 'GRID')} ?active=${mode == 'GRID'}>view_list</mwc-icon>
            <mwc-icon @click=${() => (this.mode = 'LIST')} ?active=${mode == 'LIST'}>menu</mwc-icon>
            <mwc-icon @click=${() => (this.mode = 'CARD')} ?active=${mode == 'CARD'}>apps</mwc-icon>
          </div>

          <div id="filters">
            <mwc-icon
              @click=${e => {
                const target = e.currentTarget
                this.renderRoot.querySelector('popup-menu').open({
                  left: target.offsetLeft,
                  top: target.offsetTop + target.offsetHeight
                })
              }}
              >sort</mwc-icon
            >
            <mwc-icon
              @click=${e => {
                const target = e.currentTarget
                this.renderRoot.querySelector('popup-menu').open({
                  left: target.offsetLeft,
                  top: target.offsetTop + target.offsetHeight
                })
              }}
              >more_horiz</mwc-icon
            >
            <mwc-icon
              @click=${e => {
                const target = e.currentTarget
                this.renderRoot.querySelector('popup-menu').open({
                  left: target.offsetLeft,
                  top: target.offsetTop + target.offsetHeight
                })
              }}
              >sort</mwc-icon
            >

            <popup-menu>
              <popup-menuitem
                label="click me to toggle"
                @click=${function (e) {
                  const icon = e.currentTarget.querySelector('mwc-icon')
                  icon.innerHTML = icon.innerHTML == 'check' ? '' : 'check'
                }}
              >
                <mwc-icon slot="icon" style="width: 20px;height: 20px;"></mwc-icon>
              </popup-menuitem>
              <popup-menuitem
                label="click me to toggle"
                @click=${function (e) {
                  const icon = e.currentTarget.querySelector('mwc-icon')
                  icon.innerHTML = icon.innerHTML == 'check' ? '' : 'check'
                }}
              >
                <mwc-icon slot="icon" style="width: 20px;height: 20px;"></mwc-icon>
              </popup-menuitem>
            </popup-menu>
          </div>
        </div>
      </ox-grist>
    `
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    var total = 120993
    var start = (page - 1) * limit

    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      total,
      records: Array(limit * page > total ? total % limit : limit)
        .fill()
        .map((item, idx) => {
          return {
            id: idx,
            name: idx % 2 ? `냉온수 히트펌프 공정` : `흡수식 냉동기/냉온수기`,
            description: idx % 2 ? `냉온수 히트펌프 공정` : `흡수식 냉동기/냉온수기 공정`,
            active: Math.round(Math.random() * 2) % 2 ? true : false,
            image:
              idx % 2
                ? `http://www.hatiolab.com/assets/img/operato-biz3.png`
                : `http://www.hatiolab.com/assets/img/thingsboard-30.png`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        })
    }
  }

  get gristConfig() {
    return {
      list: {
        thumbnail: function (record, rowIndex) {
          return html` <img src=${record.image} style="width: 100%; height: 100%;" /> `
        },
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
          icon: 'favorite',
          handlers: {
            click: 'record-view'
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'edit',
          handlers: {
            click: 'record-view'
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
          width: 200
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
          handlers: {
            dblclick: () => {
              const grist = document.querySelector('ox-grist')
              console.log(grist.dirtyRecords)
            }
          },
          sortable: true,
          width: 60
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
        classifier: function (record, rowIndex) {
          const rate = record['rate']
          const emphasized =
            rate < 10 ? ['black', 'white'] : rate < 25 ? ['yellow', 'blue'] : rate < 40 ? ['cyan', 'red'] : undefined
          return {
            emphasized
          }
        }
      },
      sorters: [
        {
          name: 'name',
          desc: true
        },
        {
          name: 'email'
        }
      ],
      pagination: {
        pages: [20, 30, 50, 100, 200]
      }
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
  }
}

window.customElements.define('process-list', ProcessListPage)
