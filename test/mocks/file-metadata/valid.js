import metadata from './metadata.js'

const VALID_METADATA = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  metadata
}

const VALID_MESSAGE = {
  body: {
    ...VALID_METADATA
  }
}
export {
  VALID_METADATA,
  VALID_MESSAGE
}
