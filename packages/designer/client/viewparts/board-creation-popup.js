import '@material/mwc-textfield'
import '@material/mwc-textarea'
import '@material/mwc-select'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-button'

import { LitElement, css, html } from 'lit-element'
import { i18next, localize } from '@things-factory/i18n-base'

export class BoardCreationPopup extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      /* default group id */
      defaultGroup: String,
      groups: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          padding: 10px;
          background-color: white;
        }

        :host > * {
          margin: 10px;
        }

        [content] {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        [content] > * {
          margin: 10px 0;
        }
      `
    ]
  }

  render() {
    var groups = this.groups || []

    return html`
      <div content>
        <mwc-textfield label=${i18next.t('label.name')} name="name" required name></mwc-textfield>
        <mwc-textarea label=${i18next.t('label.description')} name="description" description></mwc-textarea>
        <mwc-select
          label=${i18next.t('label.group')}
          group
          helper="If there is no group to choose, you can leave it empty."
        >
          ${groups.map(
            group => html`
              <mwc-list-item value=${group.id} ?selected=${this.defaultGroup == group.id}>${group.name}</mwc-list-item>
            `
          )}
        </mwc-select>
      </div>

      <mwc-button raised label=${i18next.t('button.create')} @click=${e => this.onClickSubmit(e)}></mwc-button>
    `
  }

  onClickSubmit(e) {
    var [name, description, groupId] = ['name', 'description', 'group'].map(attr => {
      return this.renderRoot.querySelector(`[${attr}]`).value
    })

    if (!name) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('create-board', {
        detail: {
          name,
          description,
          groupId
        }
      })
    )
  }
}

customElements.define('process-creation-popup', BoardCreationPopup)
