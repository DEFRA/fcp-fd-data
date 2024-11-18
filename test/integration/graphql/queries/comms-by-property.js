export default {
  query: `query CommsByProperty($key: commsEnum!, $value: String!) {
          commsByProperty(key: $key, value: $value) {
            id
            dateCreated
            commsMessage {
              id
              data {
                crn
                sbi
                commsType
                reference
                commsAddress
                sourceSystem
                emailReplyToId
                statusDetails
                coorelationId
                personalisation
              }
              time
              type
              source
              specversion
              datacontenttype
            }
          }
        }`
}
