/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import '@things-factory/modeller-ui/client/editors/things-editor-angle-input'

import { LitElement, html } from 'lit-element'

import { EffectsSharedStyle } from './effects-shared-style'
import { convert } from './value-converter'

/**
 * 컴포넌트의 animation 속성을 편집하는 element

Example:

    <process-property-animation .value=${animation}>
    </process-property-animation>
*/
export default class PropertyAnimation extends LitElement {
  static get properties() {
    return {
      value: Object,
      scene: Object
    }
  }

  static get styles() {
    return [EffectsSharedStyle]
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
      <label>Animation Type</label>
      <select value-key="type" .value=${this.value && this.value.type}>
        <option value="">None</option>
        <option value="rotation">Rotation</option>
        <option value="vibration">Vibration</option>
        <option value="heartbeat">Heartbeat</option>
        <option value="moving">Moving</option>
        <option value="fade">Fade</option>
        <option value="outline">Outline</option>
      </select>

      <label> <i18n-msg msgid="label.waiting-time">waiting time</i18n-msg> </label>
      <input type="number" value-key="delay" .value=${this.value.delay} placeholder="ms" />

      <label> <i18n-msg msgid="label.duration">duration</i18n-msg> </label>
      <input type="number" value-key="duration" .value=${this.value.duration} placeholder="ms" />

      ${this.value.type == 'rotation' || this.value.type == 'vibration'
        ? html`
            <label> <i18n-msg msgid="label.theta">theta</i18n-msg> </label>
            <things-editor-angle-input value-key="theta" .radian=${this.value.theta}> </things-editor-angle-input>
          `
        : html``}
      ${this.value.type == 'heartbeat'
        ? html`
            <label> <i18n-msg msgid="label.scale">scale</i18n-msg> </label>
            <input type="number" value-key="scale" .value=${this.value.scale} />
          `
        : html``}
      ${this.value.type == 'moving'
        ? html`
            <label> <i18n-msg msgid="label.x-axes">X-axes</i18n-msg> </label>
            <input type="number" value-key="x" .value=${this.value.x} />

            <label> <i18n-msg msgid="label.y-axes">Y-axes</i18n-msg> </label>
            <input type="number" value-key="y" .value=${this.value.y} />
          `
        : html``}
      ${this.value.type == 'fade'
        ? html`
            <label> <i18n-msg msgid="label.start-alpha">start alpha</i18n-msg> </label>
            <input type="number" value-key="startAlpha" .value=${this.value.startAlpha} />

            <label> <i18n-msg msgid="label.end-alpha">end alpha</i18n-msg> </label>
            <input type="number" value-key="endAlpha" .value=${this.value.endAlpha} />
          `
        : html``}
      ${this.value.type == 'outline'
        ? html`
            <label> <i18n-msg msgid="label.target">target</i18n-msg> </label>
            <input value-key="rideOn" .value=${this.value.rideOn || ''} list="target-list" />
            <datalist id="target-list">
              ${this.scene.ids.map(info => info.key).map(id => html` <option value=${id}></option> `)}
            </datalist>
          `
        : html``}

      <input id="checkbox-repeat" value-key="repeat" type="checkbox" .checked=${this.value.repeat} />
      <label for="checkbox-repeat" class="checkbox-label"> <i18n-msg msgid="label.repeat">repeat</i18n-msg> </label>

      <label>delta</label>
      <select value-key="delta" .value=${this.value.delta}>
        <option value="linear">linear</option>
        <option value="quad">quad</option>
        <option value="circ">circ</option>
        <option value="back">back</option>
        <option value="bounce">bounce</option>
        <option value="elastic">elastic</option>
      </select>

      <label>ease</label>
      <select value-key="ease" .value=${this.value.ease}>
        <option value="in">in</option>
        <option value="out">out</option>
        <option value="inout">inout</option>
      </select>
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

customElements.define('process-property-animation', PropertyAnimation)