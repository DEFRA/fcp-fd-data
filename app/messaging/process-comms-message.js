import util from 'util'

const processCommsMessage = async (message, receiver) => {
  console.log('Customer update received:', util.inspect(message.body, false, null, true))
  await receiver.completeMessage(message)
}

export default processCommsMessage
