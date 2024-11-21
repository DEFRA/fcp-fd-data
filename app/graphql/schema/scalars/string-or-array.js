import { GraphQLScalarType, Kind } from 'graphql'

const StringOrArray = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'Custom scalar that can be either a string or an array of strings',
  parseValue (value) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value
    }
    throw new Error('Value must be either a string or an array of strings')
  },
  serialize (value) {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value
    }
    throw new Error('Value must be either a string or an array of strings')
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value
    }
    if (ast.kind === Kind.LIST) {
      return ast.values.map(value => {
        if (value.kind === Kind.STRING) {
          return value.value
        }
        throw new Error('Value must be either a string or an array of strings')
      })
    }
    throw new Error('Value must be either a string or an array of strings')
  }
})

export default StringOrArray
