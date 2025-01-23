const MESSAGE_CONTENT = {
  id: '123e4567-e89b-12d3-a456-426655440000',
  source: '/mycontext',
  type: 'com.example.someevent',
  specversion: '1.0',
  datacontenttype: 'application/json',
  time: '2023-10-17T14:48:00.000Z',
  data: {
    sbi: '123456789',
    blobReference: '550e8400-e29b-41d4-a716-446655440000'
  }
}

const VALID_METADATA = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  metadata: {
    ...MESSAGE_CONTENT
  }
}

const VALID_MESSAGE = {
  body: {
    ...VALID_METADATA
  }
}

export {
  MESSAGE_CONTENT,
  VALID_METADATA,
  VALID_MESSAGE
}
