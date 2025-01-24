import db from '../../../data/index.js'

const getCommsEventById = async (_, { id }) => {
  const event = await db.commsEvent.findByPk(id)
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
        commsAddresses: event.commsMessage.data.commsAddresses,
        sourceSystem: event.commsMessage.data.sourceSystem,
        emailReplyToId: event.commsMessage.data.emailReplyToId,
        statusDetails: event.commsMessage.data.statusDetails,
        correlationId: event.commsMessage.data.correlationId,
        personalisation: event.commsMessage.data.personalisation,
        notifyTemplateId: event.commsMessage.data.notifyTemplateId
      },
      time: event.commsMessage.time,
      type: event.commsMessage.type,
      source: event.commsMessage.source,
      specversion: event.commsMessage.specversion,
      datacontenttype: event.commsMessage.datacontenttype
    }
  }
}

export default getCommsEventById
