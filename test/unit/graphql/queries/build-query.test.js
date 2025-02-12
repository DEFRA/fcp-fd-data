import buildQuery from '../../../../app/graphql/resolvers/comms-message/get-by-property/build-query.js'
import enumMap from '../../../../app/graphql/schema/comms-message/enum-map.js'

describe('build the correct raw SQL query for get comms message by property', () => {
  const topLevelTestCases = [
    { key: 'ID', value: '123', expected: '"commsMessage"->>\'id\' = \'123\'' },
    { key: 'TIME', value: '2021-01-01T00:00:00Z', expected: '"commsMessage"->>\'time\' = \'2021-01-01T00:00:00Z\'' },
    { key: 'TYPE', value: 'uk.gov.fcp.sfd.notification.request', expected: '"commsMessage"->>\'type\' = \'uk.gov.fcp.sfd.notification.request\'' },
    { key: 'SOURCE', value: 'ffc-ahwr-claim', expected: '"commsMessage"->>\'source\' = \'ffc-ahwr-claim\'' },
    { key: 'SPECVERSION', value: '1.0', expected: '"commsMessage"->>\'specversion\' = \'1.0\'' }
  ]

  const nestedTestCases = [
    { key: 'CRN', value: '1050000000', expected: '"commsMessage"->\'data\'->\'crn\' ?| ARRAY[\'1050000000\']' },
    { key: 'SBI', value: '456', expected: '"commsMessage"->\'data\'->\'sbi\' ?| ARRAY[\'456\']' },
    { key: 'COMMS_TYPE', value: 'email', expected: '"commsMessage"->\'data\'->\'commsType\' ?| ARRAY[\'email\']' },
    { key: 'REFERENCE', value: 'ffc-ahwr-example-reference', expected: '"commsMessage"->\'data\'->\'reference\' ?| ARRAY[\'ffc-ahwr-example-reference\']' },
    { key: 'COMMS_ADDRESSES', value: 'jane.doe@defra.gov.uk', expected: '"commsMessage"->\'data\'->\'commsAddresses\' ?| ARRAY[\'jane.doe@defra.gov.uk\']' },
    { key: 'SOURCE_SYSTEM', value: 'AHWP', expected: '"commsMessage"->\'data\'->\'sourceSystem\' ?| ARRAY[\'AHWP\']' },
    { key: 'EMAIL_REPLY_TO_ID', value: '8e222534-7f05-4972-86e3-17c5d9f894e2', expected: '"commsMessage"->\'data\'->\'emailReplyToId\' ?| ARRAY[\'8e222534-7f05-4972-86e3-17c5d9f894e2\']' },
    { key: 'CORRELATION_ID', value: 'a058de5b-42ad-473c-91e7-0797a43fda30', expected: '"commsMessage"->\'data\'->\'correlationId\' ?| ARRAY[\'a058de5b-42ad-473c-91e7-0797a43fda30\']' },
    { key: 'PERSONALISATION', value: 'personalisation', expected: '"commsMessage"->\'data\'->\'personalisation\' ?| ARRAY[\'personalisation\']' },
    { key: 'NOTIFY_TEMPLATE_ID', value: 'd8017132-1909-4bee-b604-b07e8081dc82', expected: '"commsMessage"->\'data\'->\'notifyTemplateId\' ?| ARRAY[\'d8017132-1909-4bee-b604-b07e8081dc82\']' }
  ]
  const arrayTestCases = [
    { key: 'COMMS_ADDRESSES', value: ['jane.doe@defra.gov.uk', 'john.doe@defra.gov.uk'], expected: '"commsMessage"->\'data\'->\'commsAddresses\' ?| ARRAY[\'jane.doe@defra.gov.uk\', \'john.doe@defra.gov.uk\']' },
    { key: 'REFERENCE', value: ['example-reference1', 'example-reference2'], expected: '"commsMessage"->\'data\'->\'reference\' ?| ARRAY[\'example-reference1\', \'example-reference2\']' }
  ]

  topLevelTestCases.forEach(({ key, value, expected }) => {
    test(`should build correct query for toplevel key: ${key}`, () => {
      const mappedKey = enumMap[key]
      const query = buildQuery(mappedKey, [value])
      expect(query).toContain(expected)
    })
  })

  nestedTestCases.forEach(({ key, value, expected }) => {
    test(`should build correct query for nested key: ${key}`, () => {
      const mappedKey = enumMap[key]
      const query = buildQuery(mappedKey, [value])
      expect(query).toContain(expected)
    })
  })

  arrayTestCases.forEach(({ key, value, expected }) => {
    test(`should build correct query when key: ${key} is an array`, () => {
      const mappedKey = enumMap[key]
      const query = buildQuery(mappedKey, value)
      expect(query).toContain(expected)
    })
  })
})
