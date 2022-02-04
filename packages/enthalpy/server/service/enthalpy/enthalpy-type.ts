import { Field, Float, Int, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Enthalpy' })
export class Enthalpy {
  @Field(type => String)
  name: string

  @Field(type => Int)
  temperature: number

  @Field(type => Float)
  enthaply: number
}

@ObjectType()
export class EnthalpyList {
  @Field(type => [Enthalpy])
  items: Enthalpy[]

  @Field(type => Int)
  total: number
}
