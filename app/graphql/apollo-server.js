import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { graphqlConfig } from '../config/index.js'
import { isLowerEnv } from '../utils/is-lower-env.js'
import schema from './index.js'
let plugins = []

if (!isLowerEnv(process.env.ENVIRONMENT_CODE)) {
  plugins = [ApolloServerPluginLandingPageDisabled()]
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
}

export default new ApolloServer({
  schema,
  introspection: graphqlConfig.get('enableIntrospection'),
  plugins
})
