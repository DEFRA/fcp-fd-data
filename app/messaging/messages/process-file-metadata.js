import schema from '../schemas/file-metadata/schema.js'
import db from '../../data/index.js'

const processFileMetadata = async (message, receiver) => {
  try {
    const { error, value: validData } = schema.validate(message.body)

    if (error) {
      console.error('Validation error:', error.details)
      await receiver.abandonMessage(message)
      return
    }

    validData.dateCreated = new Date().toISOString()
    await db.fileMetadata.create(validData)
    await receiver.completeMessage(message)
    console.log('File metadata message processed successfully, eventId:', validData.id)
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processFileMetadata
