import convict from 'convict'

const isTestOrDev = process.env.ENVIRONMENT_CODE === 'test' || process.env.ENVIRONMENT_CODE === 'dev'

const graphql = convict({
  environmentCode: {
    doc: 'Use of environment code',
    format: Boolean,
    default: isTestOrDev
  }
})

graphql.validate({ allowed: 'strict' })

export default graphql
