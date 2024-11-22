export default {
  query: `query CommsEventByPK($commsEventByPKId: String!) {
    commsEventByPK(id: $commsEventByPKId) {
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
