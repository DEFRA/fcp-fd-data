import commsResolvers from './comms-message.js'
import scalars from '../schema/scalars/index.js'

const resolvers = {
  Timestamp: scalars.Timestamp,
  ...commsResolvers
}

export default resolvers
