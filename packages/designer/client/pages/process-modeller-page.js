import { css, html } from 'lit-element'

import { ProcessModellerPage } from '@smart-design-platform/process-modeller'

export class AppProcessModellerPage extends AppProcessModellerPage {
  static get styles() {
    return [...ProcessModellerPage.styles, css``]
  }

  renderBrandingZone() {
    return html``
  }
}

customElements.define('process-modeller', ProcessModellerPage)
