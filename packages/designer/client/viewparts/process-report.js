import '@material/mwc-icon'

import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

import { client } from '@things-factory/shell'

export class ProcessReport extends LitElement {
  static get properties() {
    return {
      boardId: String,
      board: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: var(--main-section-background-color);
          min-width: 350px;
          overflow: auto;
        }

        img {
          display: block;

          margin: auto;
          max-width: 100%;
          max-height: 100%;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }

        table {
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
    var board = this.board || { name: '' }

    return html`
      ${board.thumbnail ? html` <img src=${board.thumbnail} /> ` : html``}

      <table></table>
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
  }

  close() {
    history.back()
  }
}

customElements.define('process-report', ProcessReport)
