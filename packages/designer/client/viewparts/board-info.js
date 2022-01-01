import '@material/mwc-icon'

import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit'

import { i18next } from '@things-factory/i18n-base'
import { client, navigate } from '@things-factory/shell'

export class BoardInfo extends LitElement {
  static get properties() {
    return {
      boardId: String,
      board: Object,
      groupId: String,
      boardGroupList: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: var(--main-section-background-color);
          height: 100%;
          min-width: 350px;
          overflow: auto;
          position: relative;

          --form-grid-gap: 2px 0;
          --input-field-padding: var(--padding-default);
          --legend-padding: var(--padding-default) 0 var(--padding-narrow) 0;
          --mdc-button-horizontal-padding: var(--padding-default);
        }

        img {
          display: block;

          margin: auto;
          max-width: 100%;
          max-height: 100%;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }

        form {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-gap: var(--form-grid-gap);
          grid-auto-rows: minmax(24px, auto);
          padding: var(--padding-wide);
          align-items: center;
        }

        [buttons] {
          grid-column: span 12;
          padding: var(--padding-default) 0;
          text-align: right;
        }

        [buttons] * {
          margin: 0 0 0 var(--margin-narrow);
        }
        [danger] {
          float: left;
          margin: 0 var(--margin-narrow) 0 0;
          --mdc-theme-primary: var(--status-danger-color);
        }

        fieldset {
          display: contents;
        }

        legend {
          grid-column: span 12;
          padding: var(--legend-padding);
          font: var(--legend-font);
          color: var(--legend-text-color);
          text-transform: capitalize;
        }

        label {
          grid-column: span 12;
          text-transform: capitalize;
          color: var(--label-color);
          font: var(--label-font);
        }

        span {
          grid-column: span 12;
          border-bottom: var(--border-dark-color);
          margin-bottom: var(--margin-default);
          padding-bottom: var(--padding-narrow);
          font: var(--input-field-font);
        }
        span mwc-icon {
          vertical-align: middle;
          font-size: var(--fontsize-large);
          color: var(--primary-color);
        }

        input,
        table,
        select,
        textarea,
        [custom-input] {
          grid-column: span 12;

          border: var(--input-field-border);
          border-radius: var(--input-field-border-radius);
          margin-bottom: var(--margin-default);
          padding: var(--input-field-padding);
          font: var(--input-field-font);
        }

        input[type='checkbox'],
        input[type='radio'] {
          place-self: center;
          margin: 0;
          grid-column: 1;
        }

        input[type='checkbox'] + label,
        input[type='radio'] + label {
          text-align: left;
          grid-column: span 11 / auto;

          font: var(--form-sublabel-font);
          color: var(--form-sublabel-color);
        }

        input:focus {
          outline: none;
          border: 1px solid var(--focus-background-color);
        }

        @media screen and (max-width: 460px) {
          :host {
            width: 100vw;
          }
        }
      `
    ]
  }

  render() {
    var board = this.board || { name: '', description: '', playGroups: [] }
    var boardGroupList = this.boardGroupList || []
    var playGroupList = (this.playGroupList || []).map(group => {
      return {
        ...group,
        checked: false
      }
    })
    ;(board.playGroups || []).map(group => {
      var playGroup = playGroupList.find(g => g.id == group.id)
      if (playGroup) {
        playGroup.checked = true
      }
    })

    return html`
      ${board.thumbnail ? html` <img src=${board.thumbnail} /> ` : html``}

      <form>
        <fieldset>
          <legend>${i18next.t('label.information')}</legend>
          <label>${i18next.t('label.name')}</label>
          <input type="text" .value=${board.name} @change=${e => (this.board.name = e.target.value)} />

          <label>${i18next.t('label.description')}</label>
          <input type="text" .value=${board.description} @change=${e => (this.board.description = e.target.value)} />

          <label>${i18next.t('label.group')}</label>
          <select @change=${e => (this.board.groupId = e.target.value)} .value=${this.groupId}>
            <option value="" ?selected=${'' == this.groupId}></option>
            ${boardGroupList.map(
              item => html` <option .value=${item.id} ?selected=${item.id == this.groupId}>${item.name}</option> `
            )}
          </select>
          <label>${i18next.t('label.creator')}</label>
          <span>
            <mwc-icon>person</mwc-icon> ${board.creator && board.creator.name} <mwc-icon>schedule</mwc-icon> ${new Date(
              Number(board.createdAt)
            ).toLocaleString()}
          </span>

          <label>${i18next.t('label.updater')}</label>
          <span>
            <mwc-icon>person</mwc-icon> ${board.updater && board.updater.name} <mwc-icon>schedule</mwc-icon> ${new Date(
              Number(board.updatedAt)
            ).toLocaleString()}
          </span>

          <div buttons>
            <mwc-button
              dense
              raised
              danger
              label=${i18next.t('button.delete')}
              @click=${this.deleteBoard.bind(this)}
              icon="delete_outline"
            ></mwc-button>
            <mwc-button
              dense
              raised
              label=${i18next.t('button.save')}
              @click=${this.updateBoard.bind(this)}
              icon="done"
            ></mwc-button>
            <mwc-button
              dense
              raised
              label="edit"
              @click=${() => navigate(`${'process-modeller-page/' + this.boardId}`)}
              icon="drive_file_rename_outline"
            ></mwc-button>
          </div>
        </fieldset>

        <fieldset>
          <legend>${i18next.t('label.play-group')}</legend>

          ${playGroupList.map(
            item => html`
              <input
                type="checkbox"
                value=${item.id}
                .checked=${item.checked}
                @change=${e => {
                  e.target.checked ? this.joinPlayGroup(item.id) : this.leavePlayGroup(item.id)
                }}
              />
              <label>${item.name}</label>
            `
          )}
        </fieldset>
      </form>
    `
  }

  firstUpdated() {
    this.refresh()
  }

  async refresh() {
    var response = (
      await client.query({
        query: gql`
          query FetchBoardById($id: String!) {
            board(id: $id) {
              id
              name
              description
              group {
                id
                name
              }
              playGroups {
                id
                name
              }
              thumbnail
              createdAt
              creator {
                id
                name
              }
              updatedAt
              updater {
                id
                name
              }
            }

            groups {
              items {
                id
                name
                description
              }
            }

            playGroups {
              items {
                id
                name
                description
              }
              total
            }
          }
        `,
        variables: { id: this.boardId }
      })
    ).data

    this.board = response.board
    this.boardGroupList = response.groups.items
    this.playGroupList = response.playGroups.items

    this.groupId = this.board.group?.id
  }

  async updateBoard() {
    this.dispatchEvent(
      new CustomEvent('update-board', {
        detail: this.board
      })
    )

    this.close()
  }

  async deleteBoard() {
    this.dispatchEvent(
      new CustomEvent('delete-board', {
        detail: this.boardId
      })
    )

    this.close()
  }

  async joinPlayGroup(groupId) {
    this.dispatchEvent(
      new CustomEvent('join-playgroup', {
        detail: {
          boardId: this.boardId,
          playGroupId: groupId
        }
      })
    )
  }

  async leavePlayGroup(groupId) {
    this.dispatchEvent(
      new CustomEvent('leave-playgroup', {
        detail: {
          boardId: this.boardId,
          playGroupId: groupId
        }
      })
    )
  }

  close() {
    history.back()
  }
}

customElements.define('board-info', BoardInfo)
