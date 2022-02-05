import { EnthalpyFlow } from '../'
import { Equipment } from '../models'

const JULE_PER_KWH = 3600

export class Furnace extends Equipment {
  get demandEnerge() {
    return this.spec('power') * JULE_PER_KWH
  }

  get energeEfficiency() {
    return this.spec('energeEfficiency')
  }

  async calculate() {
    const input = this.inputs[0] as EnthalpyFlow
    const output = this.outputs[0] as EnthalpyFlow

    output.constraints = {
      ...output.constraints,
      totalMassFlow: input.totalMassFlow,
      totalMolFlow: input.totalMolFlow,
      molFraction: { ...input.molFraction },
      molFlow: { ...input.molFlow },
      massFlow: { ...input.massFlow },
      massFraction: { ...input.massFraction },
      enthalpy: input.enthalpy - this.demandEnerge * this.energeEfficiency
    }

    await output.calculate()
  }
}
