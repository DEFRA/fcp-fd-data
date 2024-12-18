import { afterEach, jest } from '@jest/globals'
import { DEV, PRD, PRE, SND, TEST } from '../../../app/constants/enviroments-codes.js'

afterEach(() => {
  jest.resetModules()
  delete process.env.ENVIRONMENT_CODE
})

describe('apollo server setup', () => {
  test('disable landing page plugin when environment code is prd ', async () => {
    process.env.ENVIRONMENT_CODE = PRD
    const apolloServer = await import('../../../app/graphql/apollo-server')
    expect(apolloServer.default.internals.plugins[0].__internal_plugin_id__).toBe('LandingPageDisabled')
  })

  test('disable landing page when environment code is pre ', async () => {
    process.env.ENVIRONMENT_CODE = PRE
    const apolloServer = await import('../../../app/graphql/apollo-server')
    expect(apolloServer.default.internals.plugins[0].__internal_plugin_id__).toBe('LandingPageDisabled')
  })

  test('do not disable landing page when environment code is test ', async () => {
    process.env.ENVIRONMENT_CODE = TEST
    const apolloServer = await import('../../../app/graphql/apollo-server')
    expect(apolloServer.default.internals.plugins[0].__internal_plugin_id__).toBe(undefined)
  })

  test('do not disable landing page when environment code is dev ', async () => {
    process.env.ENVIRONMENT_CODE = DEV
    const apolloServer = await import('../../../app/graphql/apollo-server')
    expect(apolloServer.default.internals.plugins[0].__internal_plugin_id__).toBe(undefined)
  })

  test('do not disable landing page when environment code is snd ', async () => {
    process.env.ENVIRONMENT_CODE = SND
    const apolloServer = await import('../../../app/graphql/apollo-server')
    expect(apolloServer.default.internals.plugins[0].__internal_plugin_id__).toBe(undefined)
  })
})
