import { Arg, Ctx, Query, Resolver } from 'type-graphql'

import { getEnthalpy } from '../../controllers/enthalpy'
import { Enthalpy } from './enthalpy-type'

@Resolver(Enthalpy)
export class EnthalpyQuery {
  @Query(returns => Enthalpy, { description: 'To fetch a Enthalpy' })
  async enthalpy(
    @Arg('substance') substance: string,
    @Arg('temperature') temperature: number,
    @Ctx() context: any
  ): Promise<Enthalpy> {
    const enthalpy = await getEnthalpy(substance, temperature)
    return {
      substance,
      temperature,
      enthalpy
    }
  }
}
