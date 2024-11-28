import commsEventByPK from '../resolvers/queries/AHWP/get-comms-event-by-id.js'
import commsEventByProperty from '../resolvers/queries/AHWP/get-by-property.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty
  }
}

export default commsResolvers
