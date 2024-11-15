const commsMessageTypeDefs = `#graphql
scalar JSON
scalar Timestamp
scalar JSONObject

type Query {
    commsEvents: [CommsEvent]
    commsEventById(id: String!): CommsEvent
    commsByProperty(key: commsEnum!, value: String!): [CommsEvent]
  }

  type CommsEvent {
    id: String
    dateCreated: Timestamp
    commsMessage: commsMessageDetails
  }

  type commsMessageDetails{
  id: String
  data: commsData
  time: Timestamp
  type: String
  source: String
  specversion: String
  datacontenttype: String
  }

  type commsData{
  crn: Int
  sbi: Int
  commsType: String
  reference: String
  commsAddress: String
  sourceSystem: String
  emailReplyToId: String
  statusDetails: JSONObject
  coorelationId: String
  personalisation: JSONObject
  }

  enum commsEnum{
    ID
    TIME
    TYPE
    SOURCE
    SPECVERSION
    DATACONTENTTYPE
    DATE_CREATED
    COMMS_MESSAGE
    CRN
    SBI
    COMMS_TYPE
    REFERENCE
    COMMS_ADDRESS
    SOURCE_SYSTEM
    EMAIL_REPLY_TO_ID
    STATUS_DETAILS
    COORELATION_ID
    PERSONALISATION
  }
`
export default commsMessageTypeDefs
