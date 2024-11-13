import { Kind } from 'graphql/language/index.js'
import { GraphQLScalarType } from 'graphql'

const TimestampType = new GraphQLScalarType({
  name: 'Timestamp',
  description:
    'The javascript `Date` as ISO string. Type represents date and time in ISO 8601 format.',

  // Convert any input to an ISO string
  serialize (value) {
    return new Date(value).toISOString()
  },

  // Parse values from variables
  parseValue (value) {
    return new Date(value)
  },

  // Parse values from literals in queries
  parseLiteral (ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
})

export default TimestampType
