import schema from '../schemas/comms-message.js'
import db from '../../data/index.js'

const processCommsMessage = async (message, receiver) => {
  try {
    const { error, value: validData } = schema.validate(message.body)
    if (error) {
      console.error('Validation error:', error.details)
      await receiver.abandonMessage(message)
      return
    }

    validData.dateCreated = new Date().toISOString()

    await db.commsEvent.create(validData)
    await receiver.completeMessage(message)
    console.log('Message processed successfully, eventId:', validData.commsMessage.id)
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processCommsMessage
