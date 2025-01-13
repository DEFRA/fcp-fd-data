import { MessageReceiver } from 'ffc-messaging'
import { messageConfig } from '../config/index.js'
import processInboundMessage from './process-inbound-message.js'
let receiver

const start = async () => {
  const config = {
    ...messageConfig.get('messageQueue'),
    ...messageConfig.get('receiverSubscription')
  }
  receiver = new MessageReceiver(config,
    (message) => processInboundMessage(message, receiver))
  await receiver.subscribe()
  console.info('Service is ready to consume messages')
}

const stop = async () => {
  await receiver.closeConnection()
}

export default { start, stop }
