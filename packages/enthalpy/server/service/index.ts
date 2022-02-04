/* EXPORT ENTITY TYPES */

/* IMPORT ENTITIES AND RESOLVERS */
import { entities as EnthalpyParameterEntities, resolvers as EnthalpyParameterResolvers } from './enthalpy-parameter'

export const entities = [
  /* ENTITIES */
  ...EnthalpyParameterEntities
]

export const schema = {
  resolverClasses: [
    /* RESOLVER CLASSES */
    ...EnthalpyParameterResolvers
  ]
}
