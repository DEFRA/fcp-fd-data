// import commsEventByPK from './queries/get-comms-event-by-id.js'
import commsEventByProperty from './queries/get-comms-event-via-data-sources.js'
import commsEventByPaginatedProperty from './queries/get-paginated-comms.js'
import commsEventByPK from './queries/get-comms-event-by-id-via-datasource.js'
import commsEventsByProperties from './queries/get-comms-event-by-properties.js'
// import commsEventByProperty from './queries/get-comms-event-by-property.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty,
    commsEventByPaginatedProperty,
    commsEventsByProperties
  }
}

export default commsResolvers
