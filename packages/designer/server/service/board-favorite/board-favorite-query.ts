import { Resolver, Query, Args, Ctx } from 'type-graphql'
import { getRepository } from 'typeorm'
import { ListParam, buildQuery } from '@things-factory/shell'
import { Board } from '@things-factory/board-service'
import { Favorite } from '@things-factory/fav-base'
import { BoardFavorite, BoardFavoriteList } from './board-favorite-type'
import { config } from '@things-factory/env'

const ORMCONFIG = config.get('ormconfig', {})
const DATABASE_TYPE = ORMCONFIG.type

@Resolver(BoardFavorite)
export class BoardFavoriteQuery {
  @Query(returns => BoardFavoriteList, { description: 'To fetch multiple BoardFavorites' })
  async favoriteBoards(@Args() params: ListParam, @Ctx() context: any): Promise<BoardFavoriteList> {
    const { user } = context.state

    const queryBuilder = getRepository(Board).createQueryBuilder()
    buildQuery(queryBuilder, params, context)

    var joinStatement = ''
    switch (DATABASE_TYPE) {
      case 'postgres':
        joinStatement = 'CAST(Board.id as VARCHAR) = Favorite.routing'
        break
      case 'sqlite':
      default:
        joinStatement = 'Board.id = Favorite.routing'
    }

    var qb = queryBuilder
      .innerJoin(Favorite, 'Favorite', joinStatement)
      .select([
        'Board.id as id',
        'Board.name as name',
        'Board.description as description',
        'Board.thumbnail as thumbnail',
        'Favorite.id as favoriteId'
      ])
      .andWhere('Favorite.user_id = :userId', {
        userId: user.id
      })

    const items = await qb.getRawMany()
    const total = await qb.getCount()

    return { items, total }
  }
}
