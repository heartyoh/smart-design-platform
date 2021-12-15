import gql from 'graphql-tag'

import { create, error, ReferenceMap } from '@hatiolab/things-scene'
import { client, gqlContext } from '@things-factory/shell'

export function createBoardProvider() {
  var _provider = new ReferenceMap(
    async (boardId, resolve, reject) => {
      try {
        const response = await client.query({
          query: gql`
            query FetchBoardById($id: String!) {
              board(id: $id) {
                model
              }
            }
          `,
          variables: { id: boardId },
          context: gqlContext()
        })

        const board = response.data.board

        var model = JSON.parse(board.model)

        var scene

        try {
          scene = await provider.get(boardId)
          console.warn('Board fetched more than twice.', boardId)
        } catch (e) {
          scene = create({
            model,
            mode: 0,
            refProvider: provider
          })

          // s.app.baseUrl = undefined;
        }

        resolve(scene, {
          ...board,
          model
        })
      } catch (e) {
        error(e)
        reject(e)
      }
    },
    async (id, ref) => {
      ref.dispose()
    }
  )

  return _provider
}

export const provider = createBoardProvider()
