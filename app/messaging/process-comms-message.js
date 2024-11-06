import schema from './schemas/comms-message.js'
import db from '../data/index.js'

const processCommsMessage = async (message, receiver) => {
  try {
    const { error, value: validData } = schema.validate(message.body)

    if (error) {
      console.error('Validation error:', error.details)
      await receiver.abandonMessage(message)
      return
    }

    const commsMessageWithTimeStamp = {
      ...validData,
      dateCreated: new Date()
    }

    await db.commsEvent.create(commsMessageWithTimeStamp)
    await receiver.completeMessage(message)
    console.log('Message processed successfully:', commsMessageWithTimeStamp)
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processCommsMessage
