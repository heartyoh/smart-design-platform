/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import { Component, RectPath, Shape } from '@hatiolab/things-scene'

import HPUMP_IMAGE from '../assets/icon-hpump-big.png'

const NATURE = {
  mutable: false,
  resizable: false,
  rotatable: false,
  properties: []
}

export default class Hpump extends RectPath(Shape) {
  static get nature() {
    return NATURE
  }

  static get image() {
    if (!Hpump.IMAGE) {
      Hpump.IMAGE = new Image()
      Hpump.IMAGE.src = HPUMP_IMAGE
    }

    return Hpump.IMAGE
  }

  render(ctx) {
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
    this.drawImage(ctx, Hpump.image, 0, 0, width, height)

    ctx.translate(-left, -top)
  }

  get controls() {}
}

Component.register('hpump', Hpump)
