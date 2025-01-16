import db from '../../../data/index.js'
import enumMap from '../../schema/comms-message/enum-map.js'
import getCommsEventByCommsAddresses from './get-comms-event-by-comms-addresses.js'

const getCommsEventByProperty = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  value = value.toString()

  if (mappedKey === enumMap.COMMS_ADDRESSES) {
    return getCommsEventByCommsAddresses(mappedKey, value)
  } else {
    return db.commsEvent.findAll({
      where: { [`commsMessage.${mappedKey}`]: value }
    })
  }
}

export default getCommsEventByProperty
