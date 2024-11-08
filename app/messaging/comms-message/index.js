import { MessageReceiver } from 'ffc-messaging'
import { messageConfig } from '../../config/index.js'
import processCommsMessage from './process-comms-message.js'

let commsReceiver

const start = async () => {
  const config = {
    ...messageConfig.get('messageQueue'),
    ...messageConfig.get('receiverSubscription')
  }
  commsReceiver = new MessageReceiver(
    config,
    (message) => processCommsMessage(message, commsReceiver)
  )
  await commsReceiver.subscribe()
  console.info('Service is ready to consume messages')
}

const stop = async () => {
  await commsReceiver.closeConnection()
}

export default { start, stop }
