import { FlowType } from '../models'
import { EnthalpyFlowImpl } from './enthalpy-flow-impl'

export class EnthalpyOutputFlow extends EnthalpyFlowImpl {
  get type() {
    return FlowType.EnthalpyOutput
  }
}
