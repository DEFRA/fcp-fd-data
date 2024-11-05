import { setup } from './insights.js'
import 'log-timestamp'
import { createServer } from './server.js'
import messaging from './messaging/index.js'

const init = async () => {
  const server = await createServer()
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
