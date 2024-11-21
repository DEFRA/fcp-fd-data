import commsResolvers from './comms-message.js'
import scalars from '../schema/scalars/index.js'

const resolvers = {
  Timestamp: scalars.Timestamp,
  StringOrArray: scalars.StringOrArray,
  ...commsResolvers
}

export default resolvers
