import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import getCommsEventByCommsAddresses from './get-by-property-commsaddress.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  if (mappedKey === commsEnumMap.COMMS_ADDRESSES) {
    return getCommsEventByCommsAddresses(mappedKey, value)
  } else {
    return db.commsEvent.findAll({
      where: { [`commsMessage.${mappedKey}`]: value }
    })
  }
}

export default commsByProperty
