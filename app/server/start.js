import apolloServer from '../graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'
import { createServer } from './server.js'
import db from '../data/index.js'
import CommsEventDataSource from '../graphql/resolvers/queries/comms-event-data-source.js'

export default async () => {
  await apolloServer.start()
  const server = await createServer()
  await server.register({
    plugin: hapiApollo.default,
    options: {
      apolloServer,
      path: '/graphql',
      context: async (request) => {
        return {
          dataSources: {
            commsEventAPI: new CommsEventDataSource(db)
          }
        }
      }
    }
  })
  return server
}
