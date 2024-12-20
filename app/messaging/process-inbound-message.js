import { COMMS_EVENT, FILE_METADATA } from '../constants/message-types.js'
import processCommsMessage from './messages/process-comms-message.js'

// TODO refactor once aysncapi updated
const processInboundMessage = async (message, receiver) => {
  try {
    switch (true) {
      case message.body.hasOwnProperty(COMMS_EVENT): //eslint-disable-line
        console.log('Processing commsMessage')
        await processCommsMessage(message, receiver)
        break
      case message.body.hasOwnProperty(FILE_METADATA): //eslint-disable-line
        console.log('Processing fileMetadata')
        // await processFileMetadata(message)
        break
      default:
        throw new Error('Invalid message type')
    }
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processInboundMessage
