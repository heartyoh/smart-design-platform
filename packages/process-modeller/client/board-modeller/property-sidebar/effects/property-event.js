/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import './property-event-hover'
import './property-event-tap'

import { LitElement, html } from 'lit-element'

import { PropertySharedStyle } from '../property-shared-style'
import { convert } from './value-converter'

class PropertyEvent extends LitElement {
  static get properties() {
    return {
      value: Object,
      scene: Object
    }
  }

  static get styles() {
    return [PropertySharedStyle]
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
      <fieldset>
        <legend>
          <title-with-help msgid="label.hover-event" topic="board-modeller/effects/hover-event"></title-with-help>
        </legend>

        <process-property-event-hover value-key="hover" .scene=${this.scene} .value=${this.value.hover || {}}>
        </process-property-event-hover>
      </fieldset>

      <fieldset>
        <legend>
          <title-with-help msgid="label.tap-event" topic="board-modeller/effects/tap-event"></title-with-help>
        </legend>

        <process-property-event-tap value-key="tap" .scene=${this.scene} .value=${this.value.tap || {}}>
        </process-property-event-tap>
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

customElements.define('process-property-event', PropertyEvent)
