import gql from 'graphql-tag'

import { buildArgs, client } from '@operato/graphql'

export async function fetchFavoriteBoardList(listParam = {}) {
  const response = await client.query({
    query: gql`
      {
        favoriteBoards(${buildArgs(listParam)}) {
          items {
            id
            name
            description
            thumbnail
            createdAt
            updatedAt
          }
          total
        }
      }
    `
  })

  return response.data
}
