import db from '../../../data/index.js'
import enumMap from '../../schema/comms-message/enum-map.js'
import getCommsEventByCommsAddresses from './get-comms-event-by-comms-addresses.js'
import { Op } from 'sequelize'

const getCommsEventByProperty = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  const values = Array.isArray(value) ? value.map(String) : [String(value)]

  if (mappedKey === enumMap.COMMS_ADDRESSES) {
    return getCommsEventByCommsAddresses(mappedKey, value)
  }

  const commsEventRecords = await db.commsEvent.findAll({
    where: {
      [`commsMessage.${mappedKey}`]: {
        [Op.in]: values
      }
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
        crn: record.dataValues.commsMessage.data.crn,
        commsAddresses: record.dataValues.commsMessage.data.commsAddresses,
        reference: record.dataValues.commsMessage.data.reference
      }
    }
  }))
}

export default getCommsEventByProperty
