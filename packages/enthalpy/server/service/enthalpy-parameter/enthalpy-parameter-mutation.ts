import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { EnthalpyParameter } from './enthalpy-parameter'
import { EnthalpyParameterPatch, NewEnthalpyParameter } from './enthalpy-parameter-type'

@Resolver(EnthalpyParameter)
export class EnthalpyParameterMutation {
  @Mutation(returns => EnthalpyParameter, { description: 'To create new EnthalpyParameter' })
  async createEnthalpyParameter(
    @Arg('enthalpyParameter') enthalpyParameter: NewEnthalpyParameter,
    @Ctx() context: any
  ): Promise<EnthalpyParameter> {
    const { domain, user } = context.state

    return await getRepository(EnthalpyParameter).save({
      domain,
      creator: user,
      updater: user,
      ...enthalpyParameter
    })
  }

  @Mutation(returns => EnthalpyParameter, { description: 'To modify EnthalpyParameter information' })
  async updateEnthalpyParameter(
    @Arg('name') name: string,
    @Arg('patch') patch: EnthalpyParameterPatch,
    @Ctx() context: any
  ): Promise<EnthalpyParameter> {
    const { domain, user } = context.state

    const repository = getRepository(EnthalpyParameter)
    const enthalpyParameter = await repository.findOne({
      where: { domain, name }
    })

    return await repository.save({
      domain,
      creater: user,
      ...enthalpyParameter,
      ...patch,
      updater: user
    })
  }

  @Mutation(returns => Boolean, { description: 'To delete EnthalpyParameter' })
  async deleteEnthalpyParameter(@Arg('name') name: string, @Ctx() context: any): Promise<boolean> {
    const { domain } = context.state

    await getRepository(EnthalpyParameter).delete({ domain, name })
    return true
  }
}
