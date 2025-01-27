const userTypeDefinitions = `#graphql
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  user(id: ID!): User
}
`

export default userTypeDefinitions
