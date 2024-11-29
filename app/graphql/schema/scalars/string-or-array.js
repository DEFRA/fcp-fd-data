import { GraphQLScalarType, Kind } from 'graphql'

const validate = (value) => {
  if (typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'))) {
    return value
  }
  throw new Error('Value must be either a string or an array of strings')
}

const StringOrArray = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'Custom scalar that can be either a string or an array of strings',
  parseValue (value) {
    return validate(value)
  },
  serialize (value) {
    return validate(value)
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
        throw new Error('List elements must be strings')
      })
    }

    throw new Error('Value must be either a string or an array of strings')
  }
})

export default StringOrArray
