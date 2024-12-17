import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { graphqlConfig } from '../config/index.js'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'
import { DEV, SND, TEST } from '../constants/enviroments-codes.js'

let plugins = []

if (![SND, DEV, TEST].includes(process.env.ENVIRONMENT_CODE)) {
  plugins = [ApolloServerPluginLandingPageDisabled()]
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
}

export default new ApolloServer({
  typeDefs,
  resolvers,
  introspection: graphqlConfig.get('enableIntrospection'),
  plugins
})
