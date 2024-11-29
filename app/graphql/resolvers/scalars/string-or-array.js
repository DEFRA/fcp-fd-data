import { GraphQLScalarType, Kind } from 'graphql'

const validate = (value) => {
  if (typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'))) {
    return { value, error: null }
  }
  return { value: null, error: new Error('Value must be either a string or an array of strings') }
}

const StringOrArray = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'Custom scalar that can be either a string or an array of strings',
  parseValue (value) {
    const { value: validValue, error } = validate(value)
    if (error) {
      throw error
    }
    return validValue
  },
  serialize (value) {
    const { value: validValue, error } = validate(value)
    if (error) {
      throw error
    }
    return validValue
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value
    }
    if (ast.kind === Kind.LIST) {
      const values = ast.values.map(value => {
        if (value.kind === Kind.STRING) {
          return value.value
        }
        throw new Error('List elements must be strings')
      })
      return values
    }
    throw new Error('Value must be either a string or an array of strings')
  }
})

export default StringOrArray
