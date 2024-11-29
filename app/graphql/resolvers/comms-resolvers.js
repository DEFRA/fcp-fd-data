import commsEventByPK from './queries/get-comms-event-by-id.js'
import commsEventByProperty from './queries/get-by-property.js'

const commsResolvers = {
  Query: {
    commsEventByPK,
    commsEventByProperty
  }
}

export default commsResolvers
