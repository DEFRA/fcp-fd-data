const route = {
  method: 'GET',
  path: '/healthy',
  handler: (request, h) => {
    console.log('Healthy check')
    return h.response('ok').code(200)
  }
}

export default route
