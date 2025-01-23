// queries/get-comms-event-by-property.js
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import getCommsEventByCommsAddresses from './get-comms-event-by-comms-addresses.js'

const getCommsEventByProperty = async (_, { key, value }, context) => {
  const { dataSources } = context

  const { commsEventAPI } = dataSources
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  if (mappedKey === commsEnumMap.COMMS_ADDRESSES) {
    return getCommsEventByCommsAddresses(mappedKey, value)
  } else {
    return commsEventAPI.findEventByProperty(mappedKey, value)
  }
}

export default getCommsEventByProperty
