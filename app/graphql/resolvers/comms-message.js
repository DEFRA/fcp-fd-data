import commsEventByPK from '../queries/AHWP/get-comms-event-by-id.js'
import commsByProperty from '../queries/AHWP/get-by-property.js'
import StringOrArray from '../schema/scalars/string-or-array.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsByProperty
  },
  StringOrArray
}

export default commsResolvers
