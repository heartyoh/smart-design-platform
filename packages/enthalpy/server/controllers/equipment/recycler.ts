import { EnthalpyFlow } from '../'
import { Equipment } from '../models'

export class Recycler extends Equipment {
  async calculate() {
    const input = this.inputs[0] as EnthalpyFlow
    const output = this.outputs[0] as EnthalpyFlow

    input.constraints = {
      ...input.constraints,
      totalMassFlow: output.totalMassFlow,
      totalMolFlow: output.totalMolFlow,
      molFraction: { ...output.molFraction },
      molFlow: { ...output.molFlow },
      massFlow: { ...output.massFlow },
      massFraction: { ...output.massFraction }
    }

    await input.calculate()
  }
}
