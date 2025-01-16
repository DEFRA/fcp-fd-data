import commsEventByPK from './queries/get-comms-event-by-id.js'
import commsEventByProperty from './queries/get-comms-event-by-property.js'
import getMetadata from './queries/get-metadata.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty,
    getMetadata
  }
}

export default commsResolvers
