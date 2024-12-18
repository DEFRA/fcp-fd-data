import convict from 'convict'
import { TEST, DEV } from '../constants/enviroments-codes.js'

const graphql = convict({
  enableIntrospection: {
    doc: 'allow introspection',
    format: Boolean,
    default: process.env.ENVIRONMENT_CODE === TEST || process.env.ENVIRONMENT_CODE === DEV
  }
})

graphql.validate({ allowed: 'strict' })

export default graphql
