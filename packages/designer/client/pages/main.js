import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'

class DesignerMain extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;          
        }
      `
    ]
  }

  static get properties() {
    return {
      designer: String
    }
  }

  render() {
    return html`
      <section>
        <h2>Designer</h2>
        <img src=${logo}>
      </section>
    `
  }

  stateChanged(state) {
    this.designer = state.designer.state_main
  }
}

window.customElements.define('designer-main', DesignerMain)
