import { COMMS_EVENT, FILE_METADATA } from '../constants/message-types.js'
import processCommsMessage from './messages/process-comms-message.js'
import processFileMetadata from './messages/process-file-metadata.js'

const processInboundMessage = async (message, receiver) => {
  try {
    switch (true) {
      case Object.prototype.hasOwnProperty.call(message.body, COMMS_EVENT):
        await processCommsMessage(message, receiver)
        break
      case Object.prototype.hasOwnProperty.call(message.body, FILE_METADATA):
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
