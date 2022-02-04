import { EnthalpyParameter } from './enthalpy-parameter'
import { EnthalpyParameterMutation } from './enthalpy-parameter-mutation'
import { EnthalpyParameterQuery } from './enthalpy-parameter-query'

export const entities = [EnthalpyParameter]
export const resolvers = [EnthalpyParameterQuery, EnthalpyParameterMutation]
