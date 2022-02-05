export type SubstanceProperties = {
  [substance: string]: number
}

export type FlowProperties = {
  temperature: number
  pressure: number
  totalMolFlow: number
  totalMassFlow: number
  enthalpy: number

  molFraction: SubstanceProperties
  molFlow: SubstanceProperties
  massFlow: SubstanceProperties
  massFraction: SubstanceProperties
}

export type FlowConstraints = {
  temperature?: number
  pressure?: number
  totalMolFlow?: number
  totalMassFlow?: number
  enthalpy?: number

  molFraction?: SubstanceProperties
  molFlow?: SubstanceProperties
  massFlow?: SubstanceProperties
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

  spec(prop: string, value?: any): any {
    if (value !== undefined) {
      this.specs[prop] = value
    }

    return this.specs[prop]
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
      totalMassFlow: this.totalMassFlow,
      enthalpy: this.enthalpy,
      molFraction: this.molFraction,
      molFlow: this.molFlow,
      massFraction: this.massFraction,
      massFlow: this.massFlow
    }
  }

  /* abstract methods */
  abstract get constraints(): FlowConstraints
  abstract set constraints(constraints: FlowConstraints)

  abstract get temperature(): number
  abstract set temperature(temperature: number)

  abstract get pressure(): number
  abstract set pressure(pressure: number)

  abstract get totalMassFlow(): number
  abstract set totalMassFlow(totalMassFlow: number)

  abstract get totalMolFlow(): number
  abstract set totalMolFlow(totalMolFlow: number)

  abstract get enthalpy(): number

  abstract get molFraction(): SubstanceProperties
  abstract set molFraction(molFraction: SubstanceProperties)

  abstract get massFraction(): SubstanceProperties
  abstract set massFraction(massFraction: SubstanceProperties)

  abstract get molFlow(): SubstanceProperties
  abstract set molFlow(molFlow: SubstanceProperties)

  abstract get massFlow(): SubstanceProperties
  abstract set massFlow(massFlow: SubstanceProperties)

  abstract calculate(): void

  printSubstance(name: string, substance: SubstanceProperties) {
    console.log('( ', name, ' )')
    for (let subs in substance) {
      console.log(subs, ' : ', substance[subs])
    }
  }

  print() {
    console.log('[ EnthalpyFlow : ', this.name, '---')
    console.log('\ttemperature: ', this.temperature)
    console.log('\tpressure: ', this.pressure)
    console.log('\ttotalMolFlow: ', this.totalMolFlow)
    console.log('\ttotalMassFlow: ', this.totalMassFlow)
    console.log('\tenthalpy: ', this.enthalpy)
    this.printSubstance('molFraction', this.molFraction)
    this.printSubstance('massFraction', this.massFraction)
    this.printSubstance('molFlow', this.molFlow)
    this.printSubstance('massFlow', this.massFlow)
    console.log('--- EnthalpyFlow : ', this.name, ' ]')
  }
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
