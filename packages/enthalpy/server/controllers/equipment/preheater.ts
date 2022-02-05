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

    /*
      예열기의 가장 큰 특성은 공기의 투입량과 관련 속성들이 수요측에 의해 결정된다는 점이다.
      즉, 입력 공기의 특성을 찾아내기 위해서는 출력 예열 공기를 따라가야 한다.
      출력 예열 공기를 따라가면서, 확정된 엔탈피를 가진 플로우의 값을 복사해야한다.

      따라서, 예열기 calculation에서는 출력쪽 수요를 먼저 가져와서 입력쪽에 반영한다.
    */

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
