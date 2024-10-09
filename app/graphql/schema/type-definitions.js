const typeDefs = `#graphql

type Query {
  messages: [Message]
  messageById(id: ID!): Message
}

type Mutation {
  createMessage(message: String): Message
}

type Message {
  id: ID
  message: String
}
`

export { typeDefs }
