const route = {
  method: 'GET',
  path: '/healthy',
  handler: (request, h) => {
    request.logger.info('Healthy check')
    return h.response('ok').code(200)
  }
}

export default route
