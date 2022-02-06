import { Arg, Ctx, Query, Resolver } from 'type-graphql'

import { evaluate } from '../../controllers/furnace-model/setup'
import { EnthalpyFlowResult, EnthalpyFlowResultList } from './evaluation-type'

@Resolver(EnthalpyFlowResult)
export class EvaluationQuery {
  @Query(returns => EnthalpyFlowResultList, { description: 'To fetch multiple Enthalpies' })
  async evaluateEnergyConsumtion(
    @Arg('name') name: string,
    @Arg('init') init: number,
    @Ctx() context: any
  ): Promise<EnthalpyFlowResultList> {
    if (name !== 'furnace') {
      return {
        items: [],
        total: 0
      }
    }
    const flows = await evaluate(init)

    return {
      items: flows.map(flow => {
        return { name: flow.name, ...flow.calculated }
      }),
      total: flows.length
    }
  }
}
