import { GraphQLScalarType, Kind } from 'graphql'

const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'Custom scalar type for JSON data',

  parseValue (value) {
    return JSON.parse(value)
  },

  serialize (value) {
    return value
  },

  parseLiteral (ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value)
      case Kind.INT:
        return parseInt(ast.value, 10)
      case Kind.FLOAT:
        return parseFloat(ast.value)
      case Kind.BOOLEAN:
        return ast.value === 'true'
      case Kind.OBJECT: {
        const value = Object.create(null)
        ast.fields.forEach(field => {
          value[field.name.value] = this.parseLiteral(field.value)
        })
        return value
      }
      case Kind.LIST: {
        return ast.values.map(valueNode => this.parseLiteral(valueNode))
      }
      default:
        return null
    }
  }
})

export default GraphQLJSON
