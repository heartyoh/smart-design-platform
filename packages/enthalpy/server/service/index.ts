/* IMPORT ENTITIES AND RESOLVERS */
import { resolvers as EnthalpyResolvers } from './enthalpy'
import { resolvers as EvaluationResolvers } from './evaluation'

/* EXPORT ENTITY TYPES */
export * from './evaluation/evaluation-type'

export const entities = [
  /* ENTITIES */
]

export const schema = {
  resolverClasses: [
    /* RESOLVER CLASSES */
    ...EnthalpyResolvers,
    ...EvaluationResolvers
  ]
}
