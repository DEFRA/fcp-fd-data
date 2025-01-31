export default {
  query: `query CommsEventByProperty($key: commsEnum!, $value: StringOrArray!) {
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
                correlationId
                personalisation
                notifyTemplateId
                oneClickUnsubscribeUrl
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
