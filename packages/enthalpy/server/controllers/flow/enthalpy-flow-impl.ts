import { getEnthalpyParameters } from '../'
import { getEnthalpy } from '../enthalpy'
import { EnthalpyFlow, FlowConstraints, FlowProperties, FlowType, SubstanceProperties } from '../models'

export class EnthalpyFlowImpl extends EnthalpyFlow {
  constructor(name: string, constraints?: FlowConstraints) {
    super(name)

    this.constraints = constraints
  }

  _molFraction: SubstanceProperties
  _massFraction: SubstanceProperties
  _molFlow: SubstanceProperties
  _massFlow: SubstanceProperties

  _temperature: number
  _pressure: number
  _totalMassFlow: number
  _totalMolFlow: number
  _enthalpy: number

  _constraints?: FlowConstraints

  get type() {
    return FlowType.Enthalpy
  }

  get constraints(): FlowConstraints {
    return this._constraints || {}
  }

  set constraints(constraints: FlowConstraints) {
    this._constraints = constraints
  }

  get calculated(): FlowProperties {
    return {
      temperature: this._temperature,
      pressure: this._pressure,
      totalMolFlow: this._totalMolFlow,
      totalMassFlow: this._totalMassFlow,
      enthalpy: this._enthalpy,
      molFraction: this._molFraction,
      massFraction: this._massFraction,
      molFlow: this._molFlow,
      massFlow: this._massFlow,
      ...this._constraints
    }
  }

  get temperature(): number {
    return this.calculated.temperature
  }

  set temperature(temperature: number) {
    this._temperature = temperature
  }

  get pressure(): number {
    return this.calculated.pressure
  }

  set pressure(pressure: number) {
    this._pressure = pressure
  }

  get totalMassFlow(): number {
    return this.calculated.totalMassFlow
  }

  set totalMassFlow(totalMassFlow: number) {
    this._totalMassFlow = totalMassFlow
  }

  get totalMolFlow(): number {
    return this.calculated.totalMolFlow
  }

  set totalMolFlow(totalMolFlow: number) {
    this._totalMolFlow = totalMolFlow
  }

  get enthalpy(): number {
    return this.calculated.enthalpy
  }

  /* default implementations */
  get molFraction() {
    return this.calculated.molFraction
  }

  set molFraction(molFraction: SubstanceProperties) {
    this._molFraction = molFraction
  }

  get massFraction() {
    return this.calculated.massFraction
  }

  set massFraction(massFraction: SubstanceProperties) {
    this._massFraction = massFraction
  }

  get molFlow() {
    return this.calculated.molFlow
  }

  set molFlow(molFlow: SubstanceProperties) {
    this._molFlow = molFlow
  }

  get massFlow() {
    return this.calculated.massFlow
  }

  set massFlow(massFlow: SubstanceProperties) {
    this._massFlow = massFlow
  }

  async calculateEnthalpy(): Promise<number> {
    const temperature = this.temperature
    const molFlow = this.molFlow

    return (
      await Promise.all(
        Object.keys(molFlow).map(async substance => {
          const kmol = molFlow[substance]
          return (await getEnthalpy(substance, temperature)) * kmol
        })
      )
    ).reduce((sum, enthalpy) => {
      sum += enthalpy
      return sum
    }, 0)
  }

  clear() {}

  async calculate(): Promise<void> {
    this.clear()

    // 다음 2가지와 temperature가 확정된 경우.
    // TODO 명세에 의한 계산룰이 필요하다.
    // 고정 인풋 : temperature
    // 가변 인풋 :
    // - case 1 : molFraction 과 totalMolFlow이 명세인 경우 => molFlow를 구할 수 있음
    // - case 2 : molFlow 가 명세인 경우 => totalMolFlow, molFraction 구할 수 있음

    const totalMolFlow = this.totalMolFlow
    const molFraction = this.molFraction

    const substances = Object.keys(this.molFraction)
    const flows = substances.map(substance => {
      const rate = molFraction[substance]
      return totalMolFlow * rate
    })

    this._molFlow = substances.reduce((sum, substance, i) => {
      sum[substance] = flows[i]
      return sum
    }, {})

    const weights = await Promise.all(
      substances.map(async substance => {
        return this.molFlow[substance] * (await getEnthalpyParameters(substance)).molecularWeight
      })
    )

    this._totalMassFlow = weights.reduce((sum, weight) => {
      sum += weight
      return sum
    }, 0)

    this._massFlow = substances.reduce((sum, substance, i) => {
      sum[substance] = weights[i]
      return sum
    }, {})

    this._massFraction = substances.reduce((sum, substance, i) => {
      sum[substance] = weights[i] / this._totalMassFlow
      return sum
    }, {})

    this._enthalpy = await this.calculateEnthalpy()
  }
}
