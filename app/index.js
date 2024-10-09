import hapiApollo from '@as-integrations/hapi'
import { setup } from './insights.js'
import 'log-timestamp'
import { server } from './server.js'
import { apolloServer } from './graphql/apollo-server.js'

const init = async () => {
  await apolloServer.start()

  await server.register({
    plugin: hapiApollo.default,
    options: {
      apolloServer,
      path: '/graphql'
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

setup()
init()
