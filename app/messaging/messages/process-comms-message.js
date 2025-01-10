import schema from '../schemas/comms-message/schema.js'
import db from '../../data/index.js'

const processCommsMessage = async (message, receiver) => {
  try {
    const { error, value: validData } = schema.validate(message.body)
    if (error) {
      receiver.deadLetterMessage(message)
      throw new Error('Validation error', error.details)
    }
    validData.dateCreated = new Date().toISOString()
    await db.commsEvent.create(validData)
    await receiver.completeMessage(message)
    console.log('Message processed successfully, eventId:', validData.commsMessage.id)
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.deadLetterMessage(message)
  }
}

export default processCommsMessage
