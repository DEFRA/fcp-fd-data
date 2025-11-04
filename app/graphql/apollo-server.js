import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { graphqlConfig } from '../config/index.js'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'
import { isLowerEnv } from '../utils/is-lower-env.js'
let plugins = []

if (isLowerEnv(process.env.ENVIRONMENT_CODE)) {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
} else {
  plugins = [ApolloServerPluginLandingPageDisabled()]
}

export default new ApolloServer({
  typeDefs,
  resolvers,
  introspection: graphqlConfig.get('enableIntrospection'),
  plugins
})
