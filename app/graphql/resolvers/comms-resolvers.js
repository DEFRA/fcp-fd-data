import commsEventByPK from './queries/get-comms-event-by-id.js'
import commsEventByProperty from './queries/get-comms-event-by-property.js'
import commsEventByPaginatedProperty from './queries/get-paginated-comms.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty,
    commsEventByPaginatedProperty
  }
}

export default commsResolvers
