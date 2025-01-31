import db from '../../../data/index.js'
import enumMap from '../../schema/comms-message/enum-map.js'
import { Op } from 'sequelize'

const getCommsEventByProperty = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  const values = Array.isArray(value) ? value.map(String) : [String(value)]

  const commsEventRecords = await db.commsEvent.findAll({
    where: {
      [Op.or]: [
        { [`commsMessage.${mappedKey}`]: { [Op.in]: values } },
        { [`commsMessage.${mappedKey}`]: { [Op.contains]: JSON.stringify(values) } }
      ]
    }
  })

  return commsEventRecords.map(record => ({
    id: record.dataValues.id,
    dateCreated: record.dataValues.dateCreated,
    commsMessage: {
      id: record.dataValues.commsMessage.id,
      time: record.dataValues.commsMessage.time,
      type: record.dataValues.commsMessage.type,
      source: record.dataValues.commsMessage.source,
      specversion: record.dataValues.commsMessage.specversion,
      datacontenttype: record.dataValues.commsMessage.datacontenttype,
      data: {
        commsType: record.dataValues.commsMessage.data.commsType,
        commsAddresses: record.dataValues.commsMessage.data.commsAddresses,
        correlationId: record.dataValues.commsMessage.data.correlationId,
        crn: record.dataValues.commsMessage.data.crn,
        emailReplyToId: record.dataValues.commsMessage.data.emailReplyToId,
        notifyTemplateId: record.dataValues.commsMessage.data.notifyTemplateId,
        oneClickUnsubscribeUrl: record.dataValues.commsMessage.data.oneClickUnsubscribeUrl,
        personalisation: record.dataValues.commsMessage.data.personalisation,
        reference: record.dataValues.commsMessage.data.reference,
        sbi: record.dataValues.commsMessage.data.sbi,
        sourceSystem: record.dataValues.commsMessage.data.sourceSystem,
        statusDetails: record.dataValues.commsMessage.data.statusDetails
      }
    }
  }))
}

export default getCommsEventByProperty
