import '@material/mwc-icon'

import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

import { PageView, store } from '@operato/shell'
import { ScrollbarStyles } from '@operato/styles'

@customElement('evaluator-home')
export class EvaluatorHome extends connect(store)(PageView) {
  static styles = [
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

  render() {
    return html`
      <table>
        <tr>
          <th></th>
          <th></th>
          <th>예열공기-A</th>
          <th>LNG</th>
          <th>Flue Gas</th>
          <th>Waste Gas</th>
          <th>공기</th>
          <th>예열공기-B</th>
          <th>배출</th>
        </tr>
        <tr total>
          <td subTh>온도</td>
          <td>K</td>
          <td>750.234</td>
          <td>298</td>
          <td>1950</td>
          <td>1250</td>
          <td>298</td>
          <td>750.243</td>
          <td>928</td>
        </tr>
        <tr total>
          <td subTh>압력</td>
          <td>bar.a</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr total>
          <td subTh>총질량유량</td>
          <td>kg/hr</td>
          <td>551.058</td>
          <td>18.367</td>
          <td>569.426</td>
          <td>569.426</td>
          <td>551.058</td>
          <td>551.058</td>
          <td>569.426</td>
        </tr>
        <tr total>
          <td subTh>총몰유량</td>
          <td>kmol/hr</td>
          <td>19.107</td>
          <td>1.148</td>
          <td>20.255</td>
          <td>20.255</td>
          <td>19.107</td>
          <td>19.107</td>
          <td>20.255</td>
        </tr>
        <tr total doubleline>
          <td subTh>엔탈피</td>
          <td>kJ/hr</td>
          <td>260,526</td>
          <td>-85,641</td>
          <td>174,188</td>
          <td>-365,119</td>
          <td>-61,917</td>
          <td>260,526</td>
          <td>-596,988</td>
        </tr>

        <tr molFrac>
          <td subTh>조성(mol. frac.)</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr molFrac>
          <td>N2</td>
          <td></td>
          <td>0.79</td>
          <td>0</td>
          <td>0.745</td>
          <td>0.745</td>
          <td>0.79</td>
          <td>0.79</td>
          <td>0.745</td>
        </tr>
        <tr molFrac>
          <td>O2</td>
          <td></td>
          <td>0.21</td>
          <td>0</td>
          <td>0.084</td>
          <td>0.084</td>
          <td>0.21</td>
          <td>0.21</td>
          <td>0.084</td>
        </tr>
        <tr molFrac>
          <td>CH4</td>
          <td></td>
          <td>0</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr molFrac>
          <td>CO2</td>
          <td></td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
          <td>0.056</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
        </tr>
        <tr molFrac doubleline>
          <td>H2O(g)</td>
          <td></td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
          <td>0.113</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
        </tr>
        <tr molFlow>
          <td subTh>성분별 몰유량</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr molFlow>
          <td>N2</td>
          <td>kmol/hr</td>
          <td>15.094</td>
          <td>0</td>
          <td>15.094</td>
          <td>15.094</td>
          <td>15.094</td>
          <td>15.094</td>
          <td>15.094</td>
        </tr>
        <tr molFlow>
          <td>O2</td>
          <td>kmol/hr</td>
          <td>0.21</td>
          <td>0</td>
          <td>0.084</td>
          <td>0.084</td>
          <td>0.21</td>
          <td>0.21</td>
          <td>0.084</td>
        </tr>
        <tr molFlow>
          <td>CH4</td>
          <td>kmol/hr</td>
          <td>0</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr molFlow>
          <td>CO2</td>
          <td>kmol/hr</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
          <td>0.056</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
        </tr>
        <tr molFlow doubleline>
          <td>H2O(g)</td>
          <td>kmol/hr</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
          <td>0.113</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
        </tr>
        <tr massFrac>
          <td subTh>성분별 질량유량</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr massFrac>
          <td>N2</td>
          <td>kg/hr</td>
          <td>0.79</td>
          <td>0</td>
          <td>0.745</td>
          <td>0.745</td>
          <td>0.79</td>
          <td>0.79</td>
          <td>0.745</td>
        </tr>
        <tr massFrac>
          <td>O2</td>
          <td>kg/hr</td>
          <td>0.21</td>
          <td>0</td>
          <td>0.084</td>
          <td>0.084</td>
          <td>0.21</td>
          <td>0.21</td>
          <td>0.084</td>
        </tr>
        <tr massFrac>
          <td>CH4</td>
          <td>kg/hr</td>
          <td>0</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr massFrac>
          <td>CO2</td>
          <td>kg/hr</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
          <td>0.056</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
        </tr>
        <tr massFrac doubleline>
          <td>H2O(g)</td>
          <td>kg/hr</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
          <td>0.113</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
        </tr>
        <tr massFlow>
          <td subTh>조성(mass frac.)</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr massFlow>
          <td>N2</td>
          <td></td>
          <td>0.79</td>
          <td>0</td>
          <td>0.745</td>
          <td>0.745</td>
          <td>0.79</td>
          <td>0.79</td>
          <td>0.745</td>
        </tr>
        <tr massFlow>
          <td>O2</td>
          <td></td>
          <td>0.21</td>
          <td>0</td>
          <td>0.084</td>
          <td>0.084</td>
          <td>0.21</td>
          <td>0.21</td>
          <td>0.084</td>
        </tr>
        <tr massFlow>
          <td>CH4</td>
          <td></td>
          <td>0</td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr massFlow>
          <td>CO2</td>
          <td></td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
          <td>0.056</td>
          <td>0</td>
          <td>0</td>
          <td>0.056</td>
        </tr>
        <tr massFlow doubleline>
          <td>H2O(g)</td>
          <td></td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
          <td>0.113</td>
          <td>0</td>
          <td>0</td>
          <td>0.113</td>
        </tr>
      </table>
    `
  }
}
