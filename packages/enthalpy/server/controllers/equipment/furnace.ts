import { getEnthalpySync } from '../enthalpy'
import { getEnthalpyParameters } from '../enthalpy-parameters'
import { goalSeek } from '../goal-seek'
import { EnthalpyFlow, Equipment, SubstanceProperties } from '../models'

const JULE_PER_KWH = 3600

export class Furnace extends Equipment {
  get demandEnerge() {
    return this.spec('power') * JULE_PER_KWH
  }

  get energeEfficiency() {
    return this.spec('energeEfficiency')
  }

  seek(temperature: number, enthalpy: number, substances: any, molFlow: SubstanceProperties) {
    const fn = (temperature: number): number => {
      // console.log('temperature', temperature)
      return Object.keys(molFlow)
        .map(substance => {
          const kmol = molFlow[substance]

          return getEnthalpySync(substances[substance], temperature) * kmol
        })
        .reduce((sum, enthalpy) => {
          sum += enthalpy
          return sum
        }, 0)
    }

    return goalSeek({
      fn,
      fnParams: [temperature],
      percentTolerance: 1,
      customToleranceFn: (x: number): boolean => {
        if (Math.abs(x - enthalpy) < 10) {
          console.log('x', x, 'enthalpy', enthalpy, Math.abs(x - enthalpy))
        }
        return Math.abs(x - enthalpy) < 10
      },
      maxIterations: 100000,
      maxStep: 0.01,
      goal: enthalpy,
      independentVariableIdx: 0
    })
  }

  async calculate() {
    const input = this.inputs[0] as EnthalpyFlow
    const output = this.outputs[0] as EnthalpyFlow

    /* output wasted gas 의 온도를 역계산하기 위해 해찾기를 수행한다. */
    const targetEnthalpy = input.enthalpy - this.demandEnerge * this.energeEfficiency
    const enthalpyParameters = await Promise.all(
      Object.keys(input.molFlow).map(async substance => await getEnthalpyParameters(substance))
    )
    const substances = enthalpyParameters.reduce((sum, parameter) => {
      sum[parameter.substance] = parameter
      return sum
    }, {})

    const temperature = this.seek(
      output.temperature || input.temperature || 1000,
      targetEnthalpy,
      substances,
      input.molFlow
    )

    console.log('------- temperature ----------', temperature)

    output.constraints = {
      ...output.constraints,
      temperature,
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
