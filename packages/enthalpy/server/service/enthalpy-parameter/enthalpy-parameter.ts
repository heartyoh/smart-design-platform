import { Field, ID, Int, ObjectType } from 'type-graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn
} from 'typeorm'

import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'

@Entity()
@Index(
  'ix_enthalpy_parameter_0',
  (EnthalpyParameter: EnthalpyParameter) => [EnthalpyParameter.domain, EnthalpyParameter.name],
  {
    unique: true
  }
)
@Index(
  'ix_enthalpy_parameter_1',
  (EnthalpyParameter: EnthalpyParameter) => [
    EnthalpyParameter.domain,
    EnthalpyParameter.parent,
    EnthalpyParameter.rank
  ],
  { unique: true }
)
@ObjectType({ description: 'Entity for EnthalpyParameter' })
export class EnthalpyParameter {
  @PrimaryGeneratedColumn('uuid')
  @Field(type => ID)
  readonly id: string

  @ManyToOne(type => Domain)
  @Field({ nullable: true })
  domain?: Domain

  @RelationId((EnthalpyParameter: EnthalpyParameter) => EnthalpyParameter.domain)
  domainId?: string

  @Column()
  @Field()
  name: string

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  description?: string

  @Column({
    nullable: true,
    default: ''
  })
  @Field({ nullable: true })
  parent?: string

  @Column({
    nullable: true
  })
  @Field(type => Int, { nullable: true })
  rank?: number

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  type?: string

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  value?: string

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  icon?: string

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  active?: boolean

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt?: Date

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt?: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  @Field({ nullable: true })
  creator?: User

  @RelationId((EnthalpyParameter: EnthalpyParameter) => EnthalpyParameter.creator)
  creatorId?: string

  @ManyToOne(type => User, {
    nullable: true
  })
  @Field({ nullable: true })
  updater?: User

  @RelationId((EnthalpyParameter: EnthalpyParameter) => EnthalpyParameter.creator)
  updaterId?: string
}
