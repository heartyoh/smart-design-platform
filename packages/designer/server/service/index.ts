/* EXPORT ENTITY TYPES */

/* IMPORT ENTITIES AND RESOLVERS */
import { entities as BoardFavoriteEntities, resolvers as BoardFavoriteResolvers } from './board-favorite'

export const entities = [
  /* ENTITIES */
  ...BoardFavoriteEntities
]

export const schema = {
  resolverClasses: [
    /* RESOLVER CLASSES */
    ...BoardFavoriteResolvers
  ]
}
