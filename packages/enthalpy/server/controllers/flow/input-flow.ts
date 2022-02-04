import { FlowType } from '../models'
import { EnthalpyFlowImpl } from './enthalpy-flow-impl'

export class EnthalpyInputFlow extends EnthalpyFlowImpl {
  get type() {
    return FlowType.EnthalpyInput
  }
}
