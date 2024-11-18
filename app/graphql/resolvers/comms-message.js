import commsEventById from '../queries/AHWP/get-comms-event-by-id.js'
import commsByProperty from '../queries/AHWP/get-by-property.js'

const commsResolvers = {
  Query: {
    commsEventById,
    commsByProperty
  }
}

export default commsResolvers
