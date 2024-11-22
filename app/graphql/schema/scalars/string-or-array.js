import { GraphQLScalarType, Kind } from 'graphql'

function validate (value) {
  if (typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'))) {
    return { value, error: null } // Return valid value
  }
  return { value: null, error: new Error('Value must be either a string or an array of strings') } // Return error
}

const StringOrArray = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'Custom scalar that can be either a string or an array of strings',
  parseValue (value) {
    const { value: validValue, error } = validate(value)
    if (error) {
      throw error // Throw the error if validation fails
    }
    return validValue // Return the valid value
  },
  serialize (value) {
    const { value: validValue, error } = validate(value)
    if (error) {
      throw error // Throw the error if validation fails
    }
    return validValue // Return the valid value
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value // Directly return string values
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
