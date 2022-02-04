import { Arg, Args, Ctx, Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { buildQuery, ListParam } from '@things-factory/shell'

import { Enthalpy, EnthalpyList } from './enthalpy-type'

@Resolver(Enthalpy)
export class EnthalpyQuery {
  @Query(returns => Enthalpy, { description: 'To fetch a Enthalpy' })
  async enthalpy(@Arg('name') name: string, @Ctx() context: any): Promise<Enthalpy> {
    const repository = getRepository(Enthalpy)

    var enthalpy: any = repository.findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater'] }
    })

    return enthalpy
  }

  @Query(returns => EnthalpyList, { description: 'To fetch multiple Enthalpys' })
  async enthalpys(@Args() params: ListParam, @Ctx() context: any): Promise<EnthalpyList> {
    const queryBuilder = getRepository(Enthalpy).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    var [items, total] = await queryBuilder.leftJoinAndSelect('Enthalpy.domain', 'Domain').getManyAndCount()

    return { items, total }
  }
}
