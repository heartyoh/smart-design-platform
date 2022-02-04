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
  _weightFlow: SubstanceProperties

  _temperature: number
  _pressure: number
  _totalWeightFlow: number
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
      totalWeightFlow: this._totalWeightFlow,
      enthalpy: this._enthalpy,
      molFraction: this._molFraction,
      massFraction: this._massFraction,
      molFlow: this._molFlow,
      weightFlow: this._weightFlow,
      ...this._constraints
    }
  }

  get temperature(): number {
    return this.calculated.temperature
  }

  get pressure(): number {
    return this.calculated.pressure
  }

  get totalWeightFlow(): number {
    return this.calculated.totalWeightFlow
  }

  get totalMolFlow(): number {
    return this.calculated.totalMolFlow
  }

  get enthalpy(): number {
    return this.calculated.enthalpy
  }

  /* default implementations */
  get molFraction() {
    return this.calculated.molFraction
  }

  get massFraction() {
    return this.calculated.massFraction
  }

  get molFlow() {
    return this.calculated.molFlow
  }

  get weightFlow() {
    return this.calculated.weightFlow
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

  async calculate(): Promise<void> {
    // 다음 3가지가 확정된 경우.
    const temperature = this.temperature
    const totalMolFlow = this.totalMolFlow
    const molFraction = this.molFraction

    const keys = Object.keys(this.molFraction)
    const flows = keys.map(substance => {
      const rate = molFraction[substance]
      return totalMolFlow * rate
    })

    this._molFlow = keys.reduce((sum, substance, i) => {
      sum[substance] = flows[i]
      return sum
    }, {})

    const weights = await Promise.all(
      keys.map(async substance => {
        return this.molFlow[substance] * (await getEnthalpyParameters(substance)).mol
      })
    )

    this._totalWeightFlow = weights.reduce((sum, weight) => {
      sum += weight
      return sum
    }, 0)

    this._weightFlow = keys.reduce(async (sum, substance, i) => {
      sum[substance] = weights[i]
      return sum
    }, {})

    this._massFraction = keys.reduce((sum, substance, i) => {
      sum[substance] = weights[i] * this._totalWeightFlow
      return sum
    }, {})

    this._enthalpy = await this.calculateEnthalpy()
  }
}
