import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import getCommsEventByCommsAddresses from './get-comms-event-by-comms-addresses.js'

const getCommsEventByProperty = async (_, { key, value }, context) => {
  const { dataSources } = context
  const { commsEventAPI } = dataSources
  const mappedKey = commsEnumMap[key]
  value = value.toString()

  console.log(`Querying for key: ${key}, mappedKey: ${mappedKey}, value: ${value}`)

  if (mappedKey === commsEnumMap.COMMS_ADDRESSES) {
    return getCommsEventByCommsAddresses(mappedKey, value)
  } else {
    const results = await commsEventAPI.findEventByProperty(mappedKey, value)
    console.log('Query Results:', results)
    return results.flat() // Flatten the array of arrays
  }
}

export default getCommsEventByProperty
