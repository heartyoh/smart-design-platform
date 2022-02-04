export type SubstanceProperties = {
  [substance: string]: number
}

export type FlowProperties = {
  temperature: number
  pressure: number
  totalMolFlow: number
  totalWeightFlow: number
  enthalpy: number

  molFraction: SubstanceProperties
  molFlow: SubstanceProperties
  weightFlow: SubstanceProperties
  massFraction: SubstanceProperties
}

export type FlowConstraints = {
  temperature?: number
  pressure?: number
  totalMolFlow?: number
  totalWeightFlow?: number
  enthalpy?: number

  molFraction?: SubstanceProperties
  molFlow?: SubstanceProperties
  weightFlow?: SubstanceProperties
  massFraction?: SubstanceProperties
}

export enum FlowType {
  Enthalpy,
  EnthalpyInput,
  EnthalpyOutput,
  HeatExchangeInput
}

export type EquipmentSpecs = {
  [prop: string]: any
}

const JULE_PER_KWH = 3600

export class Equipment {
  constructor(name: string, specs: EquipmentSpecs) {
    this.name = name
    this.specs = specs
  }

  name: string

  specs: EquipmentSpecs

  inputs: Flow[] = []
  outputs: Flow[] = []

  spec(prop: string) {
    return this.specs[prop] || 0
  }

  input(flow: Flow, index: number) {
    this.inputs[index] = flow
    flow.to = this
  }

  output(flow: Flow, index: number) {
    this.outputs[index] = flow
    flow.from = this
  }

  get energeDemand(): number {
    return this.spec('power') * JULE_PER_KWH
  }

  get energeConsumtion(): number {
    return (1 + this.spec('energyLossRate')) * this.energeDemand
  }
}

export abstract class Flow {
  constructor(name: string) {
    this.name = name
  }

  abstract get type(): FlowType

  name: string

  from: Equipment
  to: Equipment
}

export abstract class EnthalpyFlow extends Flow {
  get type() {
    return FlowType.Enthalpy
  }

  get substanceFraction(): FlowProperties {
    return {
      temperature: this.temperature,
      pressure: this.pressure,
      totalMolFlow: this.totalMolFlow,
      totalWeightFlow: this.totalWeightFlow,
      enthalpy: this.enthalpy,
      molFraction: this.molFraction,
      molFlow: this.molFlow,
      massFraction: this.massFraction,
      weightFlow: this.weightFlow
    }
  }

  /* abstract methods */
  abstract get temperature(): number
  abstract get pressure(): number
  abstract get totalWeightFlow(): number
  abstract get totalMolFlow(): number
  abstract get enthalpy(): number

  abstract get molFraction(): SubstanceProperties
  abstract get massFraction(): SubstanceProperties
  abstract get molFlow(): SubstanceProperties
  abstract get weightFlow(): SubstanceProperties

  abstract calculate(): void
}

export class HeatFlow extends Flow {
  get type() {
    return FlowType.HeatExchangeInput
  }
  // do nothing so far
}

export class Registry {
  flows: { [name: string]: Flow } = {}
  equipments: { [name: string]: Equipment } = {}
  substances: string[] = ['O2', 'N2', 'CH4', 'CO2', 'H2O']

  addFlow(flow: Flow[] | Flow) {
    if (flow instanceof Flow) {
      return this.addFlow([flow])
    }

    flow.map(f => (this.flows[f.name] = f))
  }

  getFlow(name: string) {
    return this.flows[name]
  }

  addEquipment(equipment: Equipment | Equipment[]) {
    if (equipment instanceof Equipment) {
      return this.addEquipment([equipment])
    }

    equipment.map(eq => (this.equipments[eq.name] = eq))
  }

  getEquipment(name: string) {
    return this.equipments[name]
  }
}
