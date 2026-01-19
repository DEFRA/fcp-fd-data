import { constants as httpConstants } from 'node:http2'

const healthz = {
  method: 'GET',
  path: '/healthz',
  handler: (_request, h) => {
    return h.response('ok').code(httpConstants.HTTP_STATUS_OK)
  }
}

export default healthz
