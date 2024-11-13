const commsMessageTypeDefs = `#graphql
scalar JSON
scalar Timestamp

type Query {
    commsEvents: [CommsEvent]
    commsEventsBySbi(sbi: Int!): [CommsEvent]
    commsEventById(id: String!): CommsEvent
  }

  type CommsEvent {
    id: String
    dateCreated: Timestamp
    commsMessage: JSON
  }
`
export default commsMessageTypeDefs
