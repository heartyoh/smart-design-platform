import { Field, InputType, Int, ObjectType } from 'type-graphql'

import { EnthalpyParameter } from './enthalpy-parameter'

@InputType()
export class NewEnthalpyParameter {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  parent?: string

  @Field(type => Int, { nullable: true })
  rank?: number

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  icon?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  active?: boolean
}

@InputType()
export class EnthalpyParameterPatch {
  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  parent?: string

  @Field(type => Int, { nullable: true })
  rank?: number

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  icon?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  active?: boolean
}

@ObjectType()
export class EnthalpyParameterList {
  @Field(type => [EnthalpyParameter])
  items: EnthalpyParameter[]

  @Field(type => Int)
  total: number
}
