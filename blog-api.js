export const queryAllBlogsForHome = ({ lastPostCursor, limitation }) => {
  const query =
        `
        {
          allBlogss(sortBy: date_DESC, after:"${lastPostCursor}",first:${limitation}){
            totalCount
            pageInfo{
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
            }
            edges{
              node{
                title
                date
                featured_image
                excerpt
                author {
                  _linkType
                }
                category {
                  ... on Category{
                    name
                    _meta {
                      id
                    }
                  }
                }
                _meta{
                  uid
                }
                excerpt
              }
            }
          }
        }
      `
  return query
}

export const queryBlogsWithSlug = ({ slug }) => {
  const query =
  `{
    allBlogss(uid:"${slug}") {
    edges{
      node{
        title
        date
        content
        featured_image
        excerpt
        author {
          _linkType
        }
        category {
          ... on Category{
            name
            _meta {
              id
            }
          }
        }
        _meta {
          uid
        }
        excerpt
      }
     }
    }
  }
  `
  return query
}

export const queryBlogsWithSameCategory = ({ categoryId, limitation, lastPostCursor }) => {
  const query =
    `{
      allBlogss(where:{category:"${categoryId}"},sortBy: date_DESC, after:"${lastPostCursor}",first:${limitation}){
        totalCount
        pageInfo{
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges{
          node{
            title
            date
            featured_image
            excerpt
            author {
              _linkType
            }
            category {
              ... on Category{
                name
                _meta {
                  id
                }
              }
            }
            _meta{
              uid
            }
            excerpt
          }
        }
      }
  }`
  return query
}

export const queryGetCategoryIdByName = ({ categoryName })=>{

  const query=
  `{
    allCategorys(where:{name:"${categoryName}"}){
      edges{
        node{
          name
          _meta {
            id
          }
        }
      }
    }
  }`

  return query
}

export default { queryBlogsWithSameCategory, queryBlogsWithSlug, queryAllBlogsForHome , queryGetCategoryIdByName}
