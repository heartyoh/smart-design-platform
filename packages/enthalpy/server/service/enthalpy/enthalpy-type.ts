import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Enthalpy' })
export class Enthalpy {
  @Field(type => String)
  substance: string

  @Field(type => Float)
  temperature: number

  @Field(type => Float)
  enthalpy: number
}
