import { EnthalpyFlow } from '../'
import { getEnthalpy } from '../enthalpy'
import { getEnthalpyParameters } from '../enthalpy-parameters'
import { Equipment, SubstanceProperties } from '../models'

export class Burner extends Equipment {
  get LNGInput(): EnthalpyFlow {
    return this.inputs[0] as EnthalpyFlow
  }

  get preheatedInput(): EnthalpyFlow {
    return this.inputs[1] as EnthalpyFlow
  }

  get burnedOutput(): EnthalpyFlow {
    return this.outputs[0] as EnthalpyFlow
  }

  async getCombustionHeat() {
    const ch4 = (await getEnthalpyParameters('CH4')).heatCapacity
    const o2 = (await getEnthalpyParameters('O2')).heatCapacity
    const h2o = (await getEnthalpyParameters('H2O')).heatCapacity

    return o2 + 2 * h2o - ch4
  }

  async calcEquivalentRatio() {
    const lngInputTemperature = this.LNGInput.temperature
    const outputTemperature = this.spec('outTemperature') //this.burnedOutput.temperature
    const preheatedInputTemperature = this.preheatedInput.temperature

    /* 입구 Enthalpy */
    const ch4_in = await getEnthalpy('CH4', lngInputTemperature)
    const n2_in = await getEnthalpy('N2', preheatedInputTemperature)
    const o2_in = await getEnthalpy('O2', preheatedInputTemperature)
    const co2_in = await getEnthalpy('CO2', preheatedInputTemperature)
    const h2o_in = await getEnthalpy('H2O', preheatedInputTemperature)

    /* 출구 Enthalpy */
    const ch4_out = await getEnthalpy('CH4', outputTemperature)
    const n2_out = await getEnthalpy('N2', outputTemperature)
    const o2_out = await getEnthalpy('O2', outputTemperature)
    const co2_out = await getEnthalpy('CO2', outputTemperature)
    const h2o_out = await getEnthalpy('H2O', outputTemperature)

    /* 입출구 Gap */
    const ch4_gap = ch4_out - ch4_in
    const n2_gap = n2_out - n2_in
    const o2_gap = o2_out - o2_in
    const co2_gap = co2_out - co2_in
    const h2o_gap = h2o_out - h2o_in

    return (2 * o2_gap + 7.52 * n2_gap) / (ch4_in - co2_out - 2 * h2o_out + 2 * o2_out)
  }

  async calcDemandLNGMolFlow() {
    const lngInputTemperature = this.LNGInput.temperature
    const outputTemperature = this.spec('outTemperature') //this.burnedOutput.temperature
    const preheatedInputTemperature = this.preheatedInput.temperature

    /* LNG 투입량 계산을 위한 3차 방정식 계수 - a */
    const ch4_in = await getEnthalpy('CH4', lngInputTemperature)
    const n2_out = await getEnthalpy('N2', outputTemperature)
    const o2_out = await getEnthalpy('O2', outputTemperature)
    const co2_out = await getEnthalpy('CO2', outputTemperature)
    const h2o_out = await getEnthalpy('H2O', outputTemperature)

    // CH4 + O2 => CO2 + 2H2O 로 변환된 이후의 엔탈피 차이로 이해됨.
    const a = ch4_in + 2 * o2_out - (co2_out + 2 * h2o_out)

    /* LNG 투입량 계산을 위한 3차 방정식 계수 - c */
    const n2_preheatedIn = await getEnthalpy('N2', preheatedInputTemperature)
    const o2_preheatedIn = await getEnthalpy('O2', preheatedInputTemperature)

    const n2_rate = this.preheatedInput.molFraction['N2']
    const o2_rate = this.preheatedInput.molFraction['O2']

    const SOME_RATE = 9.5 // ???
    const SOMETHING_FOR_c = -87259 / 391094 // 무엇인지 현재까지는 이해되지 않음
    const SOMETHING_FOR_d = 1136842 / 391094 // 무엇인지 현재까지는 이해되지 않음

    // 예열 공기 그대로 변환된 출력의 엔탈피 차이로 이해됨.
    const c =
      SOME_RATE *
      SOMETHING_FOR_c *
      (n2_rate * n2_preheatedIn + o2_rate * o2_preheatedIn - (n2_rate * n2_out + o2_rate * o2_out))

    /* LNG 투입량 계산을 위한 3차 방정식 계수 - d */
    const d =
      SOME_RATE *
      SOMETHING_FOR_d *
      (n2_rate * n2_preheatedIn + o2_rate * o2_preheatedIn - (n2_rate * n2_out + o2_rate * o2_out))

    const x = Math.sqrt(Math.pow(27 * Math.pow(a, 2) * d, 2) - 4 * Math.pow(-3 * a * c, 3))
    const A = Math.cbrt(0.5 * (27 * Math.pow(a, 2) * d + x))
    const B = Math.cbrt(0.5 * (27 * Math.pow(a, 2) * d - x))

    return Math.abs(-A / (3 * a) - B / (3 * a))
  }

  async calculate() {
    // LNG input의 totalMolFlow 를 설정한다.
    const totalMolFlow = await this.calcDemandLNGMolFlow()
    this.LNGInput.constraints = {
      ...this.LNGInput.constraints,
      totalMolFlow: totalMolFlow
    }

    await this.LNGInput.calculate()

    // preheatedInput의 totalMolFlow 를 설정한다.
    const calcEquivalentRatio = await this.calcEquivalentRatio()
    this.preheatedInput.constraints = {
      ...this.preheatedInput.constraints,
      totalMolFlow: (9.52 / calcEquivalentRatio) * totalMolFlow
    }
    await this.preheatedInput.calculate()

    // fluegasOutput의 totalMolFlow 를 설정한다.
    const outputTotalMolFlow = this.LNGInput.totalMolFlow + this.preheatedInput.totalMolFlow
    const outputTotalMassFlow = this.LNGInput.totalMassFlow + this.preheatedInput.totalMassFlow

    // this.burnedOutput.molFlow 을 연소반응식에 기반하여서 구성한다.
    // CH4 + 2O2 + 7.52N2 → CO2 + 2H2O + 7.52N2 : CH4와 2O2 => CO2 + 2H2O
    const fractions = this.inputs
      .filter(input => input instanceof EnthalpyFlow)
      .map((input: EnthalpyFlow) => input.molFlow)
    const outputMolFlow = {} as SubstanceProperties

    for (let fraction of fractions) {
      for (let substance in fraction) {
        let value = fraction[substance]
        let base = outputMolFlow[substance] || 0
        outputMolFlow[substance] = base + value
      }
    }

    var ch4 = outputMolFlow['CH4'] || 0
    var o2 = outputMolFlow['O2'] || 0
    var co2 = outputMolFlow['CO2'] || 0
    var h2o = outputMolFlow['H2O'] || 0

    outputMolFlow['O2'] = o2 - 2 * ch4
    outputMolFlow['CH4'] = 0
    outputMolFlow['CO2'] = co2 + ch4
    outputMolFlow['H2O'] = h2o + 2 * ch4

    // this.burnedOutput.molFraction molFlow에 기반해서 molFraction을 계산한다.
    this.burnedOutput.constraints = {
      ...this.burnedOutput.constraints,
      totalMolFlow: outputTotalMolFlow,
      totalMassFlow: outputTotalMassFlow,
      molFlow: outputMolFlow,
      // totalMolFlow: Object.keys(outputMolFlow).reduce((sum, substance) => sum + outputMolFlow[substance], 0),
      molFraction: Object.keys(outputMolFlow).reduce((sum, substance) => {
        let molFlow = outputMolFlow[substance]
        sum[substance] = molFlow / outputTotalMolFlow

        return sum
      }, {} as SubstanceProperties)
    }

    await this.burnedOutput.calculate()
  }
}
