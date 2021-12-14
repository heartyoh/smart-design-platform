/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import { Component, RectPath, Shape } from '@hatiolab/things-scene'

import RECYCLE_IMAGE from '../assets/icon-recycle-big.png'

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
      Recycle.IMAGE.src = RECYCLE_IMAGE
    }

    return Recycle.IMAGE
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
    this.drawImage(ctx, Recycle.image, 0, 0, width, height)

    ctx.translate(-left, -top)
  }

  get controls() {
    return []
  }
}

Component.register('recycle', Recycle)
