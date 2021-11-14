/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'

import { LitElement, html } from 'lit-element'

import { EffectsSharedStyle } from './effects-shared-style'
import { convert } from './value-converter'

class PropertyEventHover extends LitElement {
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
    var { action, value = '', target = '', emphasize, restore } = this.value

    return html`
      <input id="checkbox-emphasize" type="checkbox" value-key="emphasize" .checked=${emphasize} />
      <label for="checkbox-emphasize" class="checkbox-label">
        <i18n-msg msgid="label.emphasize">emphasize</i18n-msg>
      </label>

      <label> <i18n-msg msgid="label.action">action</i18n-msg> </label>
      <select id="tap-select" value-key="action" .value=${action || ''}>
        <option value=""></option>
        <option value="popup">popup target board</option>
        <option value="infoWindow">open infowindow</option>
        <option value="data-toggle">toggle(true/false) target component data</option>
        <option value="data-tristate">tristate(0/1/2) target component data</option>
        <option value="data-set">set value to target component data</option>
        <option value="value-set">set value to target component value</option>
      </select>

      <label> <i18n-msg msgid="label.target">target</i18n-msg> </label>

      ${action == 'popup'
        ? html`
            <things-editor-process-selector
              value-key="target"
              .value=${target}
              custom-editor
            ></things-editor-process-selector>
          `
        : html`
            <input
              value-key="target"
              .value=${target || ''}
              list="target-list"
              .placeholder="${this._getPlaceHoder(action)}"
            />

            <datalist id="target-list">
              ${this._getTargetList(action).map(item => html` <option .value=${item}></option> `)}
            </datalist>
          `}
      ${action == 'data-set' || action == 'value-set'
        ? html`
            <label> <i18n-msg msgid="label.value">value</i18n-msg> </label>
            <things-editor-data value-key="value" .value=${value} custom-editor fullwidth></things-editor-data>
          `
        : html``}

      <input id="checkbox-restore" type="checkbox" value-key="restore" .checked=${restore} />
      <label for="checkbox-restore" class="checkbox-label">
        <i18n-msg msgid="label.restore-on-leave">restore on leave</i18n-msg>
      </label>
    `
  }

  _getPlaceHoder(action) {
    switch (action) {
      case 'popup':
      case 'goto':
        return 'SCENE-100'
      case 'link-open':
      case 'link-move':
        return 'http://www.hatiolab.com/'
      default:
        return ''
    }
  }

  _getTargetList(action) {
    switch (action) {
      case 'data-toggle':
      case 'data-tristate':
      case 'data-set':
      case 'value-set':
        let ids = (this.scene && this.scene.ids.map(i => `#${i.key}`)) || []
        ids.unshift('(self)')
        return ids
      case 'infoWindow':
        return (
          (this.scene &&
            this.scene.ids
              .filter(i => {
                return this.scene.findById(i.key).get('type') == 'info-window'
              })
              .map(i => `${i.key}`)) ||
          []
        )
      default:
        return []
    }
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

customElements.define('process-property-event-hover', PropertyEventHover)
