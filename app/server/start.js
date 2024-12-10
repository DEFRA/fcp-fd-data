import apolloServer from '../graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'
import { createServer } from './server.js'

export default async () => {
  await apolloServer.start()
  const server = await createServer()
  await server.register({
    plugin: hapiApollo.default,
    options: {
      apolloServer,
      path: '/graphql'
    }
  })
  return server
}
