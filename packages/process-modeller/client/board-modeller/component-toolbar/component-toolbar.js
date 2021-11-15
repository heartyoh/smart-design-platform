/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import './component-menu'

import { LitElement, css, html } from 'lit-element'

class ComponentToolbar extends LitElement {
  constructor() {
    super()

    this.componentGroupList = []
    this.group = ''
    this.scene = null
    this.mode = 0
  }

  static get properties() {
    return {
      componentGroupList: Array,
      group: String,
      scene: Object,
      mode: Number
    }
  }

  static get styles() {
    return [
      css`
        :host {
          left: 0;
          display: block;
          position: relative;

          width: var(--component-toolbar-icon-size);
          background-color: var(--component-toolbar-background-color);
        }

        span {
          display: flex;
          flex-direction: row;

          width: var(--component-toolbar-icon-size);
          height: var(--component-toolbar-icon-size);
          min-width: 50%;

          border-bottom: var(--component-toolbar-border);
          margin: 0;
          background: url(/assets/images/icon-vtoolbar.png) -1px 0 no-repeat;
        }

        span[data-group='line'] {
          background-position: 50% -186px;
        }

        span[data-group='shape'] {
          background-position: 0px -284px;
        }

        span[data-group='textAndMedia'] {
          background-position: 50% -385px;
        }

        span[data-group='chartAndGauge'] {
          background-position: 50% -488px;
        }

        span[data-group='table'] {
          background-position: 50% -585px;
        }

        span[data-group='container'] {
          background-position: 50% -685px;
        }

        span[data-group='dataSource'] {
          background-position: 50% -888px;
        }

        span[data-group='IoT'] {
          background-position: -3px -788px;
        }

        span[data-group='3D'] {
          background-position: 50% -992px;
        }

        span[data-group='warehouse'] {
          background-position: -2px -1089px;
        }

        span[data-group='form'] {
          background-position: -2px -1287px;
        }

        span[data-group='etc'] {
          background-position: -1px -1189px;
        }

        .pressed {
          background-position: 0 15px;
        }

        .pressed[pressed],
        .pressed[active] {
          background-position: -3px -88px;
          background-color: #beb9b3;
        }

        process-component-menu {
          display: none;
          position: absolute;
          top: 0;
          left: var(--component-toolbar-icon-size);
          height: 100%;
          outline: none;
        }
      `
    ]
  }

  render() {
    return html`
      <span id="shift" class="pressed" @click="${e => this._onClickShift(e)}"> </span>

      ${this.componentGroupList
        .filter(group => group.templates?.length > 0)
        .map(item => html` <span data-group=${item.name} @click=${e => this._onClickGroup(e)}> </span> `)}

      <process-component-menu
        tabindex="-1"
        @focusout=${e => {
          this.group = null
        }}
        id="menu"
        .scene=${this.scene}
        .group=${this.group}
        .groups=${this.componentGroupList}
        class="shadow"
      >
      </process-component-menu>
    `
  }

  get menu() {
    return this.shadowRoot.getElementById('menu')
  }

  _setMode(mode) {
    this.mode = mode
    this.dispatchEvent(
      new CustomEvent('mode-changed', {
        bubbles: true,
        composed: true,
        detail: { value: mode }
      })
    )
  }

  _onClickShift(e) {
    var shift = this.shadowRoot.getElementById('shift')
    if (shift.hasAttribute('active')) {
      shift.removeAttribute('active')
      this._setMode(1)
    } else {
      shift.setAttribute('active', '')
      this._setMode(2)
    }
  }

  async _onClickGroup(e) {
    var button = e.target

    if (!button.hasAttribute || !button.hasAttribute('data-group')) {
      return
    }

    this.group = button.getAttribute('data-group')

    if (!this.group) return

    await this.updateComplete

    this.menu.focus()
  }
}

customElements.define('process-component-toolbar', ComponentToolbar)