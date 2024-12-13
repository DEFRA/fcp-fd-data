import { ApolloServer } from '@apollo/server'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'
import { graphqlConfig } from '../config/index.js'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'

export default new ApolloServer({
  typeDefs,
  resolvers,
  introspection: graphqlConfig.get('enableIntrospection'),
  plugins: [ApolloServerPluginLandingPageDisabled()]
})
