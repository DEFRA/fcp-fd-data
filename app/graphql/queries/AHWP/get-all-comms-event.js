import db from '../../../data/index.js'

const commsEvents = async () => {
  const response = await db.commsEvent.findAll()
  return response.map((x) => ({
    id: x.id,
    dateCreated: x.dateCreated,
    commsMessage: {
      id: x.commsMessage.id,
      data: {
        crn: x.commsMessage.data.crn,
        sbi: x.commsMessage.data.sbi,
        commsType: x.commsMessage.data.commsType,
        reference: x.commsMessage.data.reference,
        commsAddress: x.commsMessage.data.commsAddress,
        sourceSystem: x.commsMessage.data.sourceSystem,
        emailReplyToId: x.commsMessage.data.emailReplyToId,
        statusDetails: x.commsMessage.data.statusDetails,
        coorelationId: x.commsMessage.data.coorelationId,
        personalisation: x.commsMessage.data.personalisation
      },
      time: x.commsMessage.time,
      type: x.commsMessage.type,
      source: x.commsMessage.source,
      specversion: x.commsMessage.specversion,
      datacontenttype: x.commsMessage.datacontenttype
    }
  }))
}

export default commsEvents
