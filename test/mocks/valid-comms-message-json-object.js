const validCommsMessage = {
  id: '123e4567-e89b-12d3-a456-426655440000',
  commsMessage: {
    data: {
      crn: 1234567890,
      sbi: 987654321,
      commsType: 'test-commsType',
      reference: 'test-reference',
      commsAddress: 'test-commsAddress',
      sourceSystem: 'test-sourceSystem',
      emailReplyToId: 'test-emailReplyToId',
      statusDetails: { detail: 'test-statusDetails' },
      coorelationId: 'test-coorelationId',
      personalisation: { key: 'test-personalisation' }
    },
    time: new Date(),
    type: 'test-type',
    source: 'test-source',
    specversion: 'test-specversion',
    datacontenttype: 'test-datacontenttype'
  }
}

export default validCommsMessage
