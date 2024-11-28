import convict from 'convict'
import { TEST_ENV, DEV_ENV } from '../constants/enviroments-codes.js'

const graphql = convict({
  enableIntrospection: {
    doc: 'Use of environment code',
    format: Boolean,
    default: process.env.ENVIRONMENT_CODE === TEST_ENV || process.env.ENVIRONMENT_CODE === DEV_ENV
  }
})

graphql.validate({ allowed: 'strict' })

export default graphql
