/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import { Component, RectPath, Shape } from '@hatiolab/things-scene'

const FSPLIT_IMAGE = new URL('../icons/icon-fsplit-big.png', import.meta.url).href

const NATURE = {
  mutable: false,
  resizable: false,
  rotatable: false,
  properties: [
    {
      type: 'number',
      label: 'heat-loss',
      name: 'heatLoss'
    }
  ]
}

export default class FSplit extends RectPath(Shape) {
  static IMAGE: HTMLImageElement

  static get nature() {
    return NATURE
  }

  static get image() {
    if (!FSplit.IMAGE) {
      FSplit.IMAGE = new Image()
      FSplit.IMAGE.src = FSPLIT_IMAGE
    }

    return FSplit.IMAGE
  }

  render(ctx: CanvasRenderingContext2D) {
    var { left, top, width, height } = this.bounds

    ctx.translate(left, top)
    ctx.beginPath()

    var radius = 9

    ctx.moveTo(radius, 0)
    ctx.arcTo(width, 0, width, height, radius)
    ctx.arcTo(width, height, 0, height, radius)
    ctx.arcTo(0, height, 0, 0, radius)
    ctx.arcTo(0, 0, width, 0, radius)

    this.drawFill(ctx)

    ctx.beginPath()
    this.drawImage(ctx, FSplit.image, 0, 0, width, height)

    ctx.translate(-left, -top)
  }

  get controls() {
    return []
  }
}

Component.register('fsplit', FSplit)
