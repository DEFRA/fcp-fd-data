// import GraphQLJSON from '../schema/comms-message/json-scalar.js'
import TimestampType from '../schema/comms-message/timestamp-scalar.js'
import commsEventById from '../queries/AHWP/get-comms-event-by-id.js'
import commsEvents from '../queries/AHWP/get-all-comms-event.js'
import commsByProperty from '../queries/AHWP/get-by-property.js'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

const commsResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Timestamp: TimestampType,
  Query: {
    commsEventById,
    commsEvents,
    commsByProperty
  }
}

export default commsResolvers
