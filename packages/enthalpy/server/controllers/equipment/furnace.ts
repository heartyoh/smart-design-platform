import { Equipment } from '../models'

const JULE_PER_KWH = 3600

export class Furnace extends Equipment {
  get demandEnerge() {
    return this.spec('power') * JULE_PER_KWH
  }
}
