import { constants as httpConstants } from 'node:http2'

const healthy = {
  method: 'GET',
  path: '/healthy',
  handler: (_request, h) => {
    return h.response('ok').code(httpConstants.HTTP_STATUS_OK)
  }
}

export default healthy
