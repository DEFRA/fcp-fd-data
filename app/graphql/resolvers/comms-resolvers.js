import commsEventByPK from '../resolvers/queries/AHWP/get-comms-event-by-id'
import commsEventByProperty from '../resolvers/queries/AHWP/get-by-property.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty
  }
}

export default commsResolvers
