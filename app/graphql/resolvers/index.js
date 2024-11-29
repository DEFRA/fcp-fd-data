import commsResolvers from './comms-resolvers.js'
import scalars from './scalars/index.js'

const resolvers = {
  Timestamp: scalars.Timestamp,
  StringOrArray: scalars.StringOrArray,
  ...commsResolvers
}

export default resolvers
