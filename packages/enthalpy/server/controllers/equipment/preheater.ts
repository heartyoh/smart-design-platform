import { EnthalpyFlow } from '../'
import { Equipment } from '../models'

export class Preheater extends Equipment {
  get heatLoss() {
    return this.spec('heatloss')
  }

  async calculate() {
    const inputAir = this.inputs[0] as EnthalpyFlow
    const inputWasteGas = this.inputs[1] as EnthalpyFlow
    const outputDispose = this.outputs[0] as EnthalpyFlow
    const outputPreheated = this.outputs[1] as EnthalpyFlow

    outputDispose.constraints = {
      ...outputDispose.constraints,
      totalMassFlow: inputWasteGas.totalMolFlow,
      totalMolFlow: inputWasteGas.totalMolFlow,
      molFraction: { ...inputWasteGas.molFraction },
      molFlow: { ...inputWasteGas.molFlow },
      massFlow: { ...inputWasteGas.massFlow },
      massFraction: { ...inputWasteGas.massFraction }
    }

    await outputDispose.calculate()

    outputPreheated.constraints = {
      ...outputPreheated.constraints,
      temperature: inputWasteGas.temperature - this.heatLoss
    }

    await outputPreheated.calculate()

    inputAir.constraints = {
      ...inputAir.constraints,
      totalMassFlow: outputPreheated.totalMassFlow,
      totalMolFlow: outputPreheated.totalMolFlow,
      molFraction: { ...outputPreheated.molFraction },
      molFlow: { ...outputPreheated.molFlow },
      massFlow: { ...outputPreheated.massFlow },
      massFraction: { ...outputPreheated.massFraction }
    }

    await inputAir.calculate()
  }
}
