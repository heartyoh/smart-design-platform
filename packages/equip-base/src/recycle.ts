/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import { Component, RectPath, Shape } from '@hatiolab/things-scene'

const RECYCLE_IMAGE = `
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
  <style type="text/css">
    .st0{display:none;}
    .st1{display:inline;}
    .st2{fill:none;stroke:#020203;stroke-width:2;stroke-miterlimit:10;}
  </style>
  <g id="Layer_1" class="st0">
    <g class="st1">
      <polyline class="st2" points="21.6,9.4 21.6,4.6 1.6,4.6 1.6,17.7 12.5,17.7 		"/>
      <circle class="st2" cx="21.3" cy="18.3" r="7"/>
    </g>
  </g>
  <g id="Layer_2">
    <g>
      <path d="M6.4,25.6V4.1h9.1c2.3,0,4,0.2,5,0.6c1,0.4,1.9,1.1,2.5,2.1s0.9,2.1,0.9,3.4c0,1.6-0.5,2.9-1.4,4s-2.4,1.7-4.2,2
        c0.9,0.5,1.7,1.1,2.3,1.8c0.6,0.7,1.4,1.8,2.5,3.5l2.6,4.2h-5.2l-3.1-4.7c-1.1-1.7-1.9-2.7-2.3-3.2s-0.8-0.7-1.3-0.9
        s-1.2-0.2-2.2-0.2h-0.9v9H6.4z M10.7,13.2h3.2c2.1,0,3.4-0.1,3.9-0.3s0.9-0.5,1.2-0.9s0.4-1,0.4-1.6c0-0.7-0.2-1.3-0.6-1.8
        S18,8,17.2,7.8c-0.4,0-1.4-0.1-3.2-0.1h-3.4V13.2z"/>
    </g>
  </g>
  </svg>
`

const NATURE = {
  mutable: false,
  resizable: false,
  rotatable: false,
  properties: []
}

export default class Recycle extends RectPath(Shape) {
  static IMAGE: HTMLImageElement

  static get nature() {
    return NATURE
  }

  static get image() {
    if (!Recycle.IMAGE) {
      Recycle.IMAGE = new Image()
      Recycle.IMAGE.src = 'data:image/svg+xml;base64,' + btoa(RECYCLE_IMAGE)
    }

    return Recycle.IMAGE
  }

  render(ctx: CanvasRenderingContext2D) {
    var { left, top, width, height } = this.bounds

    ctx.translate(left, top)

    this.drawImage(ctx, Recycle.image, 0, 0, width, height)

    ctx.translate(-left, -top)
  }

  get controls() {
    return []
  }
}

Component.register('recycle', Recycle)
