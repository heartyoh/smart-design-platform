import '@things-factory/notification' /* for notification-badge */
import '@things-factory/auth-ui' /* for domain-switch */

import { html } from 'lit-html'

import { navigate, store } from '@operato/shell'
import { APPEND_APP_TOOL } from '@things-factory/apptool-base'
import { auth } from '@things-factory/auth-base'
import { setAuthManagementMenus } from '@things-factory/auth-ui'
import { appendViewpart, toggleOverlay, TOOL_POSITION, VIEWPART_POSITION } from '@things-factory/layout-base'
import { setupMenuPart, updateMenuTemplate } from '@things-factory/lite-menu'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_SETTING } from '@things-factory/setting-base'

import { getMenuTemplate } from './menu'

console.log(
  `%c
   ▄▄▄  ▄▄▄▄  ▄▄▄  ▄    ▄▄  ▄▄▄ ▄▄▄  ▄▄  ▄▄▄  ▄     ▄    
  ▓   ▀ ▓   ▓ ▓  ▓ ▓   ▓  ▓  ▓  ▓   ▓  ▓ ▓  ▓ ▓▀▄ ▄▀▓    
  ▀▀▄▄  ▓   ▓ ▓▀▀  ▓   ▓▀▀▓  ▓  ▓▀▀ ▓  ▓ ▓▀▀▄ ▓  ▀  ▓    
  ▄   ▓ ▓   ▓ ▓    ▓   ▓  ▓  ▓  ▓   ▓  ▓ ▓  ▓ ▓     ▓    
   ▀▀▀  ▀▀▀▀  ▀    ▀▀▀ ▀  ▀  ▀  ▀    ▀▀  ▀  ▀ ▀     ▀    
`,
  'background: #222; color: #bada55'
)

export default function bootstrap() {
  setupMenuPart({ hovering: true })
  updateMenuTemplate(getMenuTemplate())

  /* set auth management menus into more-panel */
  auth.on('profile', async ({ credential }) => {
    setAuthManagementMenus(credential)
  })

  auth.on('profile', async ({ credential }) => {
    if (credential.owner) {
      store.dispatch({
        type: ADD_MORENDA,
        morenda: {
          icon: html` <mwc-icon>device_hub</mwc-icon> `,
          name: html` <i18n-msg msgid="text.connection"></i18n-msg> `,
          action: () => {
            navigate('connection')
          }
        }
      })

      store.dispatch({
        type: ADD_MORENDA,
        morenda: {
          icon: html` <mwc-icon>format_list_numbered</mwc-icon> `,
          name: html` <i18n-msg msgid="text.scenario"></i18n-msg> `,
          action: () => {
            navigate('scenario')
          }
        }
      })

      store.dispatch({
        type: ADD_MORENDA,
        morenda: {
          icon: html` <mwc-icon>vpn_key</mwc-icon> `,
          name: html` <i18n-msg msgid="text.oauth2-clients"></i18n-msg> `,
          action: () => {
            navigate('oauth2-clients')
          }
        }
      })
    }

    store.dispatch({
      type: ADD_MORENDA,
      morenda: {
        icon: html` <mwc-icon>extension</mwc-icon> `,
        name: html` <i18n-msg msgid="text.api-sandbox"></i18n-msg> `,
        action: () => {
          navigate('api-swagger')
        }
      }
    })

    store.dispatch({
      type: ADD_MORENDA,
      morenda: {
        icon: html` <mwc-icon>help</mwc-icon> `,
        name: html` <i18n-msg msgid="text.help"></i18n-msg> `,
        action: () => {
          navigate('help')
        }
      }
    })

    /* add top-menu app-tool */
    store.dispatch({
      type: APPEND_APP_TOOL,
      tool: {
        name: 'domain-switch',
        template: html` <domain-switch rounded-corner dark></domain-switch> `,
        position: TOOL_POSITION.REAR
      }
    })

    /* setting app-tools */
    store.dispatch({
      type: APPEND_APP_TOOL,
      tool: {
        name: 'notification-badge',
        template: html`
          <notification-badge
            @click=${e => {
              toggleOverlay('notification', {
                backdrop: true
              })
            }}
          >
          </notification-badge>
        `,
        position: TOOL_POSITION.REAR
      }
    })

    /* append viewpart anchor to asidebar */
    appendViewpart({
      name: 'viewpart-info',
      viewpart: {
        show: false,
        hovering: 'edge',
        backdrop: true
      },
      position: VIEWPART_POSITION.ASIDEBAR
    })

    appendViewpart({
      name: 'notification',
      viewpart: {
        show: false,
        hovering: 'edge',
        template: html` <notification-list style="min-width: 300px;"></notification-list> `
      },
      position: VIEWPART_POSITION.ASIDEBAR
    })

    store.dispatch({
      type: ADD_SETTING,
      setting: {
        seq: 19,
        template: html` <notification-setting-let></notification-setting-let> `
      }
    })
  })
}
