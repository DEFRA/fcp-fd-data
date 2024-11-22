export default {
  query: `query CommsEventByProperty($key: commsEnum!, $value: String!) {
          commsEventByProperty(key: $key, value: $value) {
            id
            dateCreated
            commsMessage {
              id
              data {
                crn
                sbi
                commsType
                reference
                commsAddresses
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
