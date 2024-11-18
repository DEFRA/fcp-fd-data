import db from '../../../data/index.js'

const commsEvent = async (_, { id }) => {
  console.log('id', id)
  const event = await db.commsEvent.findByPk(id)
  console.log('eventId', event.id)
  console.log('event.commsMessage', event.commsMessage)
  if (!event) {
    return null
  }

  const commsMessage = typeof event.commsMessage === 'string' ? JSON.parse(event.commsMessage) : event.commsMessage

  return {
    id: event.id,
    dateCreated: event.dateCreated,
    commsMessage: {
      id: commsMessage.id,
      data: {
        crn: commsMessage.data.crn,
        sbi: commsMessage.data.sbi,
        commsType: commsMessage.data.commsType,
        reference: commsMessage.data.reference,
        commsAddress: commsMessage.data.commsAddress,
        sourceSystem: commsMessage.data.sourceSystem,
        emailReplyToId: commsMessage.data.emailReplyToId,
        statusDetails: commsMessage.data.statusDetails,
        coorelationId: commsMessage.data.coorelationId,
        personalisation: commsMessage.data.personalisation
      },
      time: commsMessage.time,
      type: commsMessage.type,
      source: commsMessage.source,
      specversion: commsMessage.specversion,
      datacontenttype: commsMessage.datacontenttype
    }
  }
}

export default commsEvent
