import { setup } from './insights.js'
import 'log-timestamp'
import messaging from './messaging/comms-message/index.js'
import registerApollo from '../app/server/start.js'

const init = async () => {
  const server = await registerApollo()
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
