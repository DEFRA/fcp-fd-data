export default {
  query: `query CommsEventById($commsEventByIdId: String!) {
    commsEventById(id: $commsEventByIdId) {
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
