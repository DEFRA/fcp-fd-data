import { MessageReceiver } from 'ffc-messaging'
import { messageConfig } from '../config/index.js'
import processCommsMessage from './process-comms-message.js'
import db from '../data/index.js' // Import the Sequelize instance and models

let commsReceiver

const start = async () => {
  const commsAction = message => processCommsMessage(message, commsReceiver, db.commsEvent) // Pass the commsEvent model
  commsReceiver = new MessageReceiver(messageConfig.commsSubscription, commsAction)
  await commsReceiver.subscribe()
  console.info('Ready to receive customer requests')
}

const stop = async () => {
  await commsReceiver.closeConnection()
}

export default { start, stop }
