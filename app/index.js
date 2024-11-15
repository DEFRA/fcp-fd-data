import { setup } from './insights.js'
import 'log-timestamp'
import { createServer } from './server.js'
import messaging from './messaging/comms-message/index.js'
import apolloServer from './graphql/apollo-server.js'
import hapiApollo from '@as-integrations/hapi'

const init = async () => {
  await apolloServer.start()
  const server = await createServer()
  await server.register({
    plugin: hapiApollo.default,
    options: {
      apolloServer,
      path: '/graphql'
    }
  })
  console.log(server)
  await server.start()
  await messaging.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', async (err) => {
  console.log(err)
  await messaging.stop()
  process.exit(1)
})

setup()
init()
