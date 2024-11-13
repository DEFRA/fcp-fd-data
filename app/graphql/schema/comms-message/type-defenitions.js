const commsMessageTypeDefs = `#graphql
scalar JSON

type Query {
    commsEvents: [CommsEvent]
    commsEventsBySbi(sbi: Int!): [CommsEvent]
    commsEventById(id: String!): CommsEvent
  }

  type CommsEvent {
    id: String
    dateCreated: String
    commsMessage: JSON
  }
`
export default commsMessageTypeDefs
