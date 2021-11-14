/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import '@things-factory/modeller-ui/client/editors/things-editor-color'

import { LitElement, css, html } from 'lit-element'

import { convert } from './value-converter'

/**
 * 컴포넌트의 그림자 속성을 편집하는 element
 *
 * Example:
 *  <process-property-shadow
 *    @change="${e => { this.shadow = e.target.value }}"
 *    value="${this.shadow}"
 *  ></process-property-shadow>
 */

export default class PropertyShadow extends LitElement {
  static get properties() {
    return {
      value: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);

          align-items: center;
        }

        * {
          align-self: stretch;
        }

        label {
          grid-column: span 3;
          text-align: right;
          text-transform: capitalize;

          align-self: center;
        }

        input[type='number'],
        things-editor-color {
          grid-column: span 7;
        }
        input[type='number'] {
          border: var(--property-sidebar-fieldset-border);
        }

        .icon-only-label {
          grid-column: span 3;
          background: url(/assets/images/icon-properties-label.png) no-repeat;
          float: left;
          margin: 0;
          align-self: stretch;
        }

        .icon-only-label.color {
          background-position: 100% -500px;
        }
      `
    ]
  }

  constructor() {
    super()

    this.value = {}
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  render() {
    return html`
      <label> <i18n-msg msgid="label.shadowOffsetX">offset-X</i18n-msg> </label>

      <input type="number" value-key="left" .value=${this.value.left} />

      <label> <i18n-msg msgid="label.shadowOffsetY">offset-Y</i18n-msg> </label>

      <input type="number" value-key="top" .value=${this.value.top} />

      <label> <i18n-msg msgid="label.shadowSize">Size</i18n-msg> </label>

      <input type="number" value-key="blurSize" .value=${this.value.blurSize} />

      <label class="icon-only-label color"></label>

      <things-editor-color value-key="color" .value=${this.value.color}> </things-editor-color>
    `
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    this.value = {
      ...this.value,
      [key]: convert(element)
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define('process-property-shadow', PropertyShadow)
