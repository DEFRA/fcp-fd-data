import db from '../../../data/index.js'

const commsEvent = async (_, { id }) => {
  console.log('id', id)
  const event = await db.commsEvent.findByPk(id)
  console.log('eventId', event.id)
  console.log('event.commsMessage', event.commsMessage)
  console.log('event.commsMessage.id', JSON.parse(event.commsMessage).id)
  if (!event) {
    return null
  }
  return {
    id: event.id,
    dateCreated: event.dateCreated,
    commsMessage: {
      id: event.commsMessage.id,
      data: {
        crn: event.commsMessage.data.crn,
        sbi: event.commsMessage.data.sbi,
        commsType: event.commsMessage.data.commsType,
        reference: event.commsMessage.data.reference,
        commsAddress: event.commsMessage.data.commsAddress,
        sourceSystem: event.commsMessage.data.sourceSystem,
        emailReplyToId: event.commsMessage.data.emailReplyToId,
        statusDetails: event.commsMessage.data.statusDetails,
        coorelationId: event.commsMessage.data.coorelationId,
        personalisation: event.commsMessage.data.personalisation
      },
      time: event.commsMessage.time,
      type: event.commsMessage.type,
      source: event.commsMessage.source,
      specversion: event.commsMessage.specversion,
      datacontenttype: event.commsMessage.datacontenttype
    }
  }
}

export default commsEvent
