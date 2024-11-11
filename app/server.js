import Hapi from '@hapi/hapi'
import HapiPino from 'hapi-pino'
import Joi from 'joi'
import healthy from './routes/healthy.js'
import healthz from './routes/healthz.js'
import hapiApollo from '@as-integrations/hapi'
import apolloServer from './graphql/apollo-server.js'

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT
  })

  const routes = [].concat(
    healthy,
    healthz
  )

  server.validator(Joi)
  server.route(routes)
  server.register({
    plugin: HapiPino,
    options: {
      logPayload: true,
      level: 'warn'
    }
  })
  await server.register({
    plugin: hapiApollo.default,
    options: {
      apolloServer,
      path: '/graphql'
    }
  })

  return server
}

export { createServer }
