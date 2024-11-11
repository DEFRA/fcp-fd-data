import { ApolloServer } from '@apollo/server'
// type defs and resolvers here
export default new ApolloServer({
  typeDefs: `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hello sfd devs!'
    }
  }
})
