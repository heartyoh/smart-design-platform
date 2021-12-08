import '@material/mwc-fab'
import '@polymer/paper-dialog/paper-dialog'
import '@operato/board' // ox-board-viewer
import './scene-viewer/process-scene-viewer'
import './component-toolbar/component-toolbar'
import './property-sidebar/property-sidebar'

import { css, html, LitElement } from 'lit-element'

export class BoardModeller extends LitElement {
  constructor() {
    super()

    this.boardName = ''
    this.model = null
    this.baseUrl = ''
    this.selected = []
    this.mode = 1
    this.provider = null
    this.hideProperty = false
    this.overlay = null
    this.scene = null
    this.componentGroupList = []
    this.fonts = []
    this.propertyEditor = []

    document.addEventListener('get-all-scene-component-ids', e => {
      var { component, callback } = e.detail

      if (!this.scene) return

      var ids
      if (component) ids = this.scene.findAll(component).map(c => c.model.id)
      else ids = this.scene.ids.map(({ key, value }) => key)

      ids = ids.filter(id => !!id).sort()
      callback(ids)
    })
  }

  static get properties() {
    return {
      boardName: String,
      model: Object,
      baseUrl: String,
      selected: Array,
      mode: Number,
      provider: Object,
      hideProperty: Boolean,
      overlay: String,
      scene: Object,
      componentGroupList: Array,
      fonts: Array,
      propertyEditor: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
          height: 100%;
          overflow: hidden;
        }

        #scene-wrap {
          flex: 1;
          position: relative;

          display: flex;
          flex-direction: row;
        }

        process-scene-viewer {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        mwc-fab {
          position: absolute;
          right: 15px;
          bottom: 15px;
        }
      `
    ]
  }

  render() {
    return html`
      <process-component-toolbar
        .scene=${this.scene}
        .mode=${this.mode}
        @mode-changed=${e => {
          this.mode = e.detail.value
        }}
        .componentGroupList=${this.componentGroupList}
        .group=${this.group}
      >
      </process-component-toolbar>

      <div id="scene-wrap">
        <process-scene-viewer
          id="scene"
          .scene=${this.scene}
          @scene-changed=${e => {
            this.scene = e.detail.value
          }}
          .model=${this.model}
          .selected=${this.selected}
          @selected-changed=${e => {
            this.selected = e.detail.value
          }}
          .mode=${this.mode}
          @mode-changed=${e => {
            this.mode = e.detail.value
          }}
          fit="ratio"
          .baseUrl=${this.baseUrl}
          @contextmenu=${e => this.onContextMenu(e)}
          .provider=${this.provider}
          name="modeller"
        >
          <process-scene-layer type="selection-layer"></process-scene-layer>
          <process-scene-layer type="modeling-layer"></process-scene-layer>
          <process-scene-layer type="guide-layer">
            <process-scene-property name="ruler" value="disabled"></process-scene-property>
          </process-scene-layer>
          <process-scene-layer type="shift-layer">
            <process-scene-property name="text" value="${this.overlay}"></process-scene-property>
            <process-scene-property name="alpha" value="0.3"></process-scene-property>
            <process-scene-property name="fontFamily" value="arial"></process-scene-property>
            <process-scene-property name="fontSize" value="30" type="number"></process-scene-property>
            <process-scene-property name="fontColor" value="navy"></process-scene-property>
            <process-scene-property name="textBaseline" value="top"></process-scene-property>
            <process-scene-property name="textAlign" value="left"></process-scene-property>
            <process-scene-property name="paddingTop" value="50" type="number"></process-scene-property>
            <process-scene-property name="paddingLeft" value="50" type="number"></process-scene-property>
          </process-scene-layer>
          <process-scene-layer type="tag-layer"></process-scene-layer>
          <process-scene-handler type="text-editor"></process-scene-handler>
          <process-scene-handler type="move-handler"></process-scene-handler>
        </process-scene-viewer>

        <mwc-fab icon="save" @click=${e => this.onTapSave(e)} title="save"> </mwc-fab>
      </div>

      <property-sidebar
        .scene=${this.scene}
        .selected=${this.selected}
        .collapsed=${this.hideProperty}
        .fonts=${this.fonts}
        .propertyEditor=${this.propertyEditor}
      >
      </property-sidebar>
    `
  }

  close() {
    this.model = null
    this.requestUpdate()
  }

  get modellingContainer() {
    return this.renderRoot.getElementById('scene-wrap')
  }

  onShortcut(e, MacOS) {
    if (MacOS) var ctrlKey = e.metaKey
    else var ctrlKey = e.ctrlKey

    switch (e.code) {
      case 'KeyS':
        if (ctrlKey) {
          this.onTapSave()
          e.preventDefault()
        }
        break
    }
  }

  preview() {
    this.previewModel = this.scene?.model ? JSON.parse(JSON.stringify(this.scene.model)) : null

    /*
     * paper-dialog appears behind backdrop when inside a <app-header-layout ..
     * https://github.com/PolymerElements/paper-dialog/issues/152
     **/

    var preview = document.createElement('ox-board-viewer')

    preview.style.width = '100%'
    preview.style.height = '100%'
    preview.style.margin = '0'
    preview.style.padding = '0'
    preview.style.flex = 1
    preview.provider = this.provider
    preview.board = {
      id: 'preview',
      model: this.previewModel
    }
    preview.baseUrl = this.baseUrl

    var dialog = document.createElement('paper-dialog')

    dialog.style.width = '100%'
    dialog.style.height = '100%'
    dialog.style.display = 'flex'
    dialog.style['flex-direction'] = 'column'
    dialog.setAttribute('with-backdrop', true)
    dialog.setAttribute('auto-fit-on-attach', true)
    dialog.setAttribute('always-on-top', true)
    dialog.addEventListener('iron-overlay-closed', () => {
      preview.board = null
      dialog.parentNode.removeChild(dialog)
    })

    dialog.appendChild(preview)
    document.body.appendChild(dialog)

    dialog.open()

    requestAnimationFrame(() => {
      dispatchEvent(new Event('resize'))
    })
  }

  onTapSave() {
    this.dispatchEvent(new CustomEvent('save-model', { bubbles: true, composed: true, detail: { model: this.model } }))
  }

  onContextMenu() {}
}

customElements.define('process-modeller', BoardModeller)
