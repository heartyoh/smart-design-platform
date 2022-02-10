import '@material/mwc-icon'

import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit'

import { client } from '@operato/graphql'
import { ScrollbarStyles } from '@operato/styles'

export class ProcessReport extends LitElement {
  static get properties() {
    return {
      boardId: String,
      board: Object,
      evaluation: Object
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: block;
          background-color: var(--main-section-background-color);
          min-width: 350px;
          overflow: auto;
        }

        img {
          display: block;

          margin: var(--margin-default) auto;
          max-width: 100%;
          max-height: 100%;
          border: var(--border-dark-color);
        }
        table {
          border-collapse: collapse;
          background-color: #fff;
          width: 100%;
        }
        tr {
          border-bottom: var(--border-dark-color);
        }
        th {
          border-top: 2px solid var(--focus-background-color);
          border-right: 1px solid var(--primary-color);
          background-color: var(--secondary-text-color);
          padding: var(--padding-narrow);
          color: var(--theme-white-color);
        }

        tr td:first-child {
          background-color: rgba(0, 0, 0, 0.05);
          text-align: right;
        }
        td {
          padding: var(--padding-narrow);
          border-right: var(--border-dark-color);
          text-align: right;
          font-size: 0.8em;
        }

        tr[doubleline] {
          border-bottom: 2px double rgba(0, 0, 0, 0.2);
        }

        [subTh] {
          text-align: center !important;
          font-weight: bold;
        }

        [molFrac] td:first-child {
          background-color: #51a8de;
          color: #fff;
        }
        [molFlow] td:first-child {
          background-color: #00b4a8;
          color: #fff;
        }
        [massFrac] td:first-child {
          background-color: #64b87c;
          color: #fff;
        }
        [massFlow] td:first-child {
          background-color: #3a6878;
          color: #fff;
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
    var evaluation = this.evaluation || []
    var substances = []
    evaluation.forEach(ev => {
      Object.keys(ev.molFraction).forEach(fr => {
        if (substances.indexOf(fr) === -1) {
          substances.push(fr)
        }
      })
    })

    return html`
      ${board.thumbnail ? html` <img src=${board.thumbnail} /> ` : html``}

      <table>
        <tr>
          <th></th>
          <th></th>
          ${evaluation.map(ev => html` <th>${ev.name}</th> `)}
        </tr>
        <tr total>
          <td subTh>온도</td>
          <td>K</td>
          ${evaluation.map(ev => html` <td>${ev.temperature.toFixed(4)}</td> `)}
        </tr>
        <tr total>
          <td subTh>압력</td>
          <td>bar.a</td>
          ${evaluation.map(ev => html` <td>${ev.pressure.toFixed(4)}</td> `)}
        </tr>
        <tr total>
          <td subTh>총질량유량</td>
          <td>kg/hr</td>
          ${evaluation.map(ev => html` <td>${ev.totalMassFlow.toFixed(4)}</td> `)}
        </tr>
        <tr total>
          <td subTh>총몰유량</td>
          <td>kmol/hr</td>
          ${evaluation.map(ev => html` <td>${ev.totalMolFlow.toFixed(4)}</td> `)}
        </tr>
        <tr total doubleline>
          <td subTh>엔탈피</td>
          <td>kJ/hr</td>
          ${evaluation.map(ev => html` <td>${ev.enthalpy.toFixed(4)}</td> `)}
        </tr>

        <tr molFrac>
          <td subTh>조성(mol. frac.)</td>
          <td></td>
          ${evaluation.map(ev => html` <td></td> `)}
        </tr>

        ${substances.map(
          (sub, idx) => html`
            <tr molFrac ?doubleline=${idx === substances.length - 1}>
              <td>${sub}</td>
              <td></td>
              ${evaluation.map(ev => html` <td>${(ev.molFraction[sub] || 0).toFixed(3)}</td> `)}
            </tr>
          `
        )}

        <tr molFrac>
          <td subTh>성분별 몰유량</td>
          <td></td>
          ${evaluation.map(ev => html` <td></td> `)}
        </tr>

        ${substances.map(
          (sub, idx) => html`
            <tr molFlow ?doubleline=${idx === substances.length - 1}>
              <td>${sub}</td>
              <td>kmol/hr</td>
              ${evaluation.map(ev => html` <td>${(ev.molFlow[sub] || 0).toFixed(3)}</td> `)}
            </tr>
          `
        )}

        <tr massFrac>
          <td subTh>성분별 질량유량</td>
          <td></td>
          ${evaluation.map(ev => html` <td></td> `)}
        </tr>

        ${substances.map(
          (sub, idx) => html`
            <tr massFrac ?doubleline=${idx === substances.length - 1}>
              <td>${sub}</td>
              <td>kmol/hr</td>
              ${evaluation.map(ev => html` <td>${(ev.massFraction[sub] || 0).toFixed(3)}</td> `)}
            </tr>
          `
        )}

        <tr massFrac>
          <td subTh>조성(mass frac.)</td>
          <td></td>
          ${evaluation.map(ev => html` <td></td> `)}
        </tr>

        ${substances.map(
          (sub, idx) => html`
            <tr massFlow ?doubleline=${idx === substances.length - 1}>
              <td>${sub}</td>
              <td>kmol/hr</td>
              ${evaluation.map(ev => html` <td>${(ev.massFlow[sub] || 0).toFixed(3)}</td> `)}
            </tr>
          `
        )}
      </table>
    `
  }

  firstUpdated() {
    this.refresh()
  }

  async refresh() {
    var response = (
      await client.query({
        query: gql`
          query FetchBoardById($id: String!, $init: Float!) {
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

            evaluateEnergyConsumtion(id: $id, init: $init) {
              items {
                name
                temperature
                pressure
                totalMolFlow
                totalMassFlow
                enthalpy
                molFlow
                molFraction
                massFlow
                massFraction
              }

              total
            }
          }
        `,
        variables: { id: this.boardId, init: 750.243 }
      })
    ).data

    this.board = response.board
    this.evaluation = response.evaluateEnergyConsumtion.items
  }

  close() {
    history.back()
  }
}

customElements.define('process-report', ProcessReport)
