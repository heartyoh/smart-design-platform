/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import './property-animation'
import '@material/mwc-icon'

import { css, html, LitElement } from 'lit-element'

import { PropertySharedStyle } from '../property-shared-style'
import { convert } from './value-converter'

class PropertyAnimations extends LitElement {
  static get properties() {
    return {
      value: Object,
      scene: Object,
      _expanded: Boolean
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      css`
        fieldset[collapsable] legend {
          box-sizing: border-box;
          width: 100%;
        }

        fieldset[collapsable] legend mwc-icon {
          float: right;
          font-size: medium;
          margin: 0;
          cursor: pointer;
        }

        fieldset[collapsable][collapsed] > :not(legend) {
          display: none;
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
      <fieldset collapsable ?collapsed=${!this._expanded}>
        <legend>
          <title-with-help topic="board-modeller/effects/animation" msgid="label.animation">animation</title-with-help>
          <mwc-icon
            @click=${e => {
              this._expanded = !this._expanded
            }}
            >${this._expanded ? 'expand_less' : 'expand_more'}</mwc-icon
          >
        </legend>

        <process-property-animation value-key="oncreate" .scene=${this.scene} .value=${this.value.oncreate || {}}>
        </process-property-animation>
      </fieldset>
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

customElements.define('process-property-animations', PropertyAnimations)
