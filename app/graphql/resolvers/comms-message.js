import GraphQLJSON from '../schema/comms-message/json-scalar.js'
import TimestampType from '../schema/comms-message/timestamp-scalar.js'
import commsEventById from '../queries/AHWP/get-comms-event-by-id.js'
import commsEvents from '../queries/AHWP/get-all-comms-event.js'
import commsEventsBySbi from '../queries/AHWP/get-comms-event-by-sbi.js'

const commsResolvers = {
  JSON: GraphQLJSON,
  Timestamp: TimestampType,
  Query: {
    commsEventById,
    commsEvents,
    commsEventsBySbi
  }
}

export default commsResolvers
