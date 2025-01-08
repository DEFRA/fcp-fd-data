import { COMMS_EVENT, FILE_METADATA } from '../constants/message-types.js'
import processCommsMessage from './messages/process-comms-message.js'
import processFileMetadata from './messages/process-file-metadata.js'

const processInboundMessage = async (message, receiver) => {
  try {
    switch (true) {
      case message.body.hasOwnProperty(COMMS_EVENT): //eslint-disable-line
        return processCommsMessage(message, receiver)
      case message.body.hasOwnProperty(FILE_METADATA): //eslint-disable-line
        return processFileMetadata(message, receiver)
      default:
        throw new Error('Invalid message type')
    }
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processInboundMessage
