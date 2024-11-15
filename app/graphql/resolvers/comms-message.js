import commsEventById from '../queries/AHWP/get-comms-event-by-id.js'
import commsEvents from '../queries/AHWP/get-all-comms-event.js'
import commsByProperty from '../queries/AHWP/get-by-property.js'

const commsResolvers = {
  Query: {
    commsEventById,
    commsEvents,
    commsByProperty
  }
}

export default commsResolvers
