import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity'
import { PRODUCTION } from '../constants/environments.js'

const isProd = () => {
  return process.env.NODE_ENV === PRODUCTION
}

const hooks = {
  beforeConnect: async (config) => {
    if (isProd()) {
      const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
      const tokenProvider = getBearerTokenProvider(
        credential,
        'https://ossrdbms-aad.database.windows.net/.default'
      )
      config.password = tokenProvider
    }
  }
}

const retry = {
  backoffBase: 500,
  backoffExponent: 1.1,
  match: [/SequelizeConnectionError/],
  max: 10,
  name: 'connection',
  timeout: 60000
}

const database = {
  database: process.env.POSTGRES_DB || 'fcp_fd_data',
  dialect: 'postgres',
  dialectOptions: {
    ssl: isProd()
  },
  hooks,
  host: process.env.POSTGRES_HOST || 'fcp-fd-data-postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  logging: process.env.POSTGRES_LOGGING || false,
  retry,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  username: process.env.POSTGRES_USERNAME
}

export default database
