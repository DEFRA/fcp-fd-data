import { GraphQLScalarType, Kind } from 'graphql'

const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'Custom scalar type for JSON data',
  parseValue (value) {
    return JSON.parse(value) // value from the client input variables
  },
  serialize (value) {
    return JSON.stringify(value) // value sent to the client
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value) // value from the client query
    }
    return null
  }
})

export default GraphQLJSON
