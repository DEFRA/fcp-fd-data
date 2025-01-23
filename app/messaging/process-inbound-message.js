import { COMMS_EVENT, FILE_METADATA } from '../constants/message-types.js'
import processCommsMessage from './messages/process-comms-message.js'
import processFileMetadata from './messages/process-file-metadata.js'

const processInboundMessage = async (message, receiver) => {
  try {
    switch (true) {
      case message.body.hasOwnProperty(COMMS_EVENT): //eslint-disable-line
        await processCommsMessage(message, receiver)
        break
      case message.body.hasOwnProperty(FILE_METADATA): //eslint-disable-line
        await processFileMetadata(message, receiver)
        break
      default:
        console.warn('Invalid message type received')
        await receiver.deadLetterMessage(message)
    }
  } catch (err) {
    console.error('Error processing request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processInboundMessage
