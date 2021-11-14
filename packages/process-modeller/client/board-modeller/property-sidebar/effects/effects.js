/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import './property-animations'
import './property-event'
import './property-shadow'

import { AbstractProperty } from '../abstract-property'
import { PropertySharedStyle } from '../property-shared-style'
import { html } from 'lit-element'

class PropertyEffects extends AbstractProperty {
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
    this.renderRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  render() {
    return html`
      <fieldset>
        <legend>
          <title-with-help topic="board-modeller/effects/shadow" msgid="label.shadow">shadow</title-with-help>
        </legend>

        <process-property-shadow value-key="shadow" .value=${this.value.shadow || {}}> </process-property-shadow>
      </fieldset>

      <fieldset>
        <legend>
          <title-with-help topic="board-modeller/effects/retention" msgid="label.retention">retention</title-with-help>
        </legend>

        <div class="property-grid">
          <label> <i18n-msg msgid="label.retention">retention</i18n-msg> </label>
          <input type="number" value-key="retention" .value=${this.value.retention} placeholder="ms" />
        </div>
      </fieldset>

      <process-property-animations value-key="animation" .scene=${this.scene} .value=${this.value.animation || {}}>
      </process-property-animations>

      <process-property-event value-key="event" .scene=${this.scene} .value=${this.value.event || {}}>
      </process-property-event>
    `
  }
}

customElements.define('process-property-effect', PropertyEffects)
