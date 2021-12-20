import { ObjectType, Field, Int } from 'type-graphql'

import { Board } from '@things-factory/board-service'

@ObjectType()
export class BoardFavorite extends Board {
  @Field({ nullable: true })
  favoriteId?: string
}

@ObjectType()
export class BoardFavoriteList {
  @Field(type => [BoardFavorite])
  items: BoardFavorite[]

  @Field(type => Int)
  total: number
}
