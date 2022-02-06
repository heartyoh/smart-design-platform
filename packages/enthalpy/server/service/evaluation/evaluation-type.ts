import { Field, Float, Int, ObjectType } from 'type-graphql'

import { ScalarAny } from '@things-factory/shell'

@ObjectType()
export class EnthalpyFlowResult {
  @Field(type => String)
  name: string

  @Field(type => Float)
  temperature: number

  @Field(type => Float)
  pressure: number

  @Field(type => Float)
  totalMolFlow: number

  @Field(type => Float)
  totalMassFlow: number

  @Field(type => Float)
  enthalpy: number

  @Field(type => ScalarAny)
  molFraction: ScalarAny

  @Field(type => ScalarAny)
  molFlow: ScalarAny

  @Field(type => ScalarAny)
  massFlow: ScalarAny

  @Field(type => ScalarAny)
  massFraction: ScalarAny
}

@ObjectType()
export class EnthalpyFlowResultList {
  @Field(type => [EnthalpyFlowResult])
  items: EnthalpyFlowResult[]

  @Field(type => Int)
  total: number
}
