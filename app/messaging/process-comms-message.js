import commsEventValidation from './schemas/schema.js'

const processCommsMessage = async (message, receiver, commsEventModel) => {
  try {
    const { error, value: validData } = commsEventValidation.validate(message.body)

    if (error) {
      console.error('Validation error:', error.details)
      await receiver.abandonMessage(message)
      return
    }

    const commsMessageWithTimeStamp = {
      ...validData,
      dateCreated: new Date()
    }

    await commsEventModel.create(commsMessageWithTimeStamp)
    await receiver.completeMessage(message)
    console.log('Message processed successfully:', commsMessageWithTimeStamp)
  } catch (err) {
    console.error('Unable to process request:', err)
    await receiver.abandonMessage(message)
  }
}

export default processCommsMessage
