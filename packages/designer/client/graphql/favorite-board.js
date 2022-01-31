import gql from 'graphql-tag'

import { client } from '@operato/graphql'

export async function fetchFavoriteBoardList({ filters, page, limit, sortings = [] }) {
  const response = await client.query({
    query: gql`
      query ($filters: [Filter!], $pagination: Pagination, $sortings: [Sorting!]) {
        favoriteBoards(filters: $filters, pagination: $pagination, sortings: $sortings) {
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
    `,
    variables: {
      filters,
      pagination: { page, limit },
      sortings
    }
  })

  return response.data
}
