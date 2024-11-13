import GraphQLJSON from '../schema/comms-message/scalars.js'
import commsEventById from '../queries/AHWP/get-comms-event-by-id.js'
import commsEvents from '../queries/AHWP/get-all-comms-event.js'
import commsEventsBySbi from '../queries/AHWP/get-comms-event-by-sbi.js'

const commsResolvers = {
  JSON: GraphQLJSON,
  Query: {
    commsEventById,
    commsEvents,
    commsEventsBySbi
  }
}

export default commsResolvers
