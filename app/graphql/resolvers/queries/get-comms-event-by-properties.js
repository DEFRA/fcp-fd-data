import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import getCommsEventByCommsAddresses from './get-comms-event-by-comms-addresses.js'

const commsEventsByProperties = async (_, { queries }, context) => {
  const { dataSources } = context
  const { commsEventAPI } = dataSources

  const results = await Promise.all(queries.map(async ({ key, value }) => {
    const mappedKey = commsEnumMap[key]
    value = Array.isArray(value) ? value.map(v => v.toString()) : value.toString()

    console.log(`Querying for key: ${key}, mappedKey: ${mappedKey}, value: ${value}`)

    if (mappedKey === commsEnumMap.COMMS_ADDRESSES) {
      return getCommsEventByCommsAddresses(mappedKey, value)
    } else {
      return commsEventAPI.findEventByProperty(mappedKey, value)
    }
  }))

  console.log('Query Results:', results)
  return results
}

export default commsEventsByProperties
