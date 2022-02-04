import { Arg, Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { getRepository } from 'typeorm'

import { User } from '@things-factory/auth-base'
import { Board } from '@things-factory/board-service'
import { buildQuery, Domain, ListParam } from '@things-factory/shell'

import { EnthalpyParameter } from './enthalpy-parameter'
import { EnthalpyParameterList } from './enthalpy-parameter-type'

@Resolver(EnthalpyParameter)
export class EnthalpyParameterQuery {
  @Query(returns => EnthalpyParameter, { description: 'To fetch a EnthalpyParameter' })
  async enthalpyParameter(@Arg('name') name: string, @Ctx() context: any): Promise<EnthalpyParameter> {
    const repository = getRepository(EnthalpyParameter)

    var enthalpyParameter: any = repository.findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater'] }
    })

    return enthalpyParameter
  }

  @Query(returns => EnthalpyParameterList, { description: 'To fetch multiple EnthalpyParameters' })
  async enthalpyParameters(@Args() params: ListParam, @Ctx() context: any): Promise<EnthalpyParameterList> {
    const queryBuilder = getRepository(EnthalpyParameter).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    var [items, total] = await queryBuilder.leftJoinAndSelect('EnthalpyParameter.domain', 'Domain').getManyAndCount()

    return { items, total }
  }

  @FieldResolver(type => Board)
  async board(@Root() enthalpyParameter: EnthalpyParameter) {
    if (enthalpyParameter.type == 'board' && enthalpyParameter.value) {
      return await getRepository(Board).findOne({ id: enthalpyParameter.value })
    }
  }

  @FieldResolver(type => Domain)
  async domain(@Root() enthalpyParameter: EnthalpyParameter) {
    return await getRepository(Domain).findOne(enthalpyParameter.domainId)
  }

  @FieldResolver(type => User)
  async updater(@Root() enthalpyParameter: EnthalpyParameter): Promise<User> {
    return await getRepository(User).findOne(enthalpyParameter.updaterId)
  }

  @FieldResolver(type => User)
  async creator(@Root() enthalpyParameter: EnthalpyParameter): Promise<User> {
    return await getRepository(User).findOne(enthalpyParameter.creatorId)
  }
}
