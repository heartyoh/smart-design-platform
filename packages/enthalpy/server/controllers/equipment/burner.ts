import { EnthalpyFlow } from '../'
import { getEnthalpy } from '../enthalpy'
import { getEnthalpyParameters } from '../enthalpy-parameters'
import { Equipment } from '../models'

export class Burner extends Equipment {
  get LNGInput(): EnthalpyFlow {
    return this.inputs[0] as EnthalpyFlow
  }

  get preheatedInput(): EnthalpyFlow {
    return this.inputs[1] as EnthalpyFlow
  }

  get burnedOutput(): EnthalpyFlow {
    return this.outputs[1] as EnthalpyFlow
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

    console.log('ch4_in', ch4_in)

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

    /**** 원래 로직은 아래와 같지만, NaN이 나오는 결과가 있어서, 허수의 가능성을 두고 절대값을 씌움. 임시방편으로 원래의 로직을 점검할 필요가 있어보임.  */
    // const A = Math.pow(0.5 * (27 * Math.pow(a, 2) * d + x), 1 / 3)
    // const B = Math.pow(0.5 * (27 * Math.pow(a, 2) * d - x), 1 / 3)

    // return -A / (3 * a) - B / (3 * a)
    /**** 이상 원래의 로직임.  */

    const A = Math.pow(0.5 * Math.abs(27 * Math.pow(a, 2) * d + x), 1 / 3)

    console.log('A - ', A)

    const B = Math.pow(0.5 * Math.abs(27 * Math.pow(a, 2) * d - x), 1 / 3)

    console.log('B - ', x, B, -A / (3 * a) - B / (3 * a))

    return Math.abs(-A / (3 * a) - B / (3 * a))
  }

  async calculate() {
    // LNG input의 totalMolFlow 를 설정한다.
    const totalMolFlow = await this.calcDemandLNGMolFlow()
    this.LNGInput.totalMolFlow = totalMolFlow
    await this.LNGInput.calculate()

    // preheatedInput의 totalMolFlow 를 설정한다.
    const calcEquivalentRatio = await this.calcEquivalentRatio()
    this.preheatedInput.totalMolFlow = (9.52 / calcEquivalentRatio) * totalMolFlow
    await this.preheatedInput.calculate()

    // fluegasOutput의 totalMolFlow 를 설정한다.
    this.burnedOutput.totalMolFlow = this.LNGInput.totalMolFlow + this.preheatedInput.totalMolFlow
    this.burnedOutput.totalWeightFlow = this.LNGInput.totalWeightFlow + this.preheatedInput.totalWeightFlow
    // this.burnedOutput.molFlow 을 연소반응식에 기반하여서 구성한다.
    // this.burnedOutput.molFraction molFlow에 기반해서 molFraction을 계산한다.
    // 이후로는 this.burnedOuptpu.calculate() 를 실행한다.
  }
}
