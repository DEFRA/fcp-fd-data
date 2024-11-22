const commsMessageTypeDefs = `#graphql
# Scalars for custom data types
scalar JSON # Represents a JSON object
scalar Timestamp # Custom scalar for timestamp values
scalar JSONObject # Represents a generic JSON object
scalar StringOrArray # Represents a string or an array of strings

# Availble queries operations
type Query {
  commsEventByPK(id: String!): CommsEvent # GET a specific comms event by its ID
  commsEventByProperty(key: commsEnum!, value: String!): [CommsEvent] # GET comms events filtered by a specific property and value
}

# comms-event received from the upstream comms service
type CommsEvent {
  id: String # Unique identifier for the comms event UUID standard
  dateCreated: Timestamp # Date and time when event has been saved in fd-data database
  commsMessage: commsMessageDetails # Details of the event message
}

# Details of a communication message
type commsMessageDetails {
  id: String # Unique identifier for the comms message
  data: commsData # Structured business data related to the comms message
  time: Timestamp # Time of the message
  type: String # Type of the message
  source: String # Source system of the message
  specversion: String # Specification version of the message Cloud Events format
  datacontenttype: String # Content type of the message data
}

# Data structure for communication content
type commsData {
  crn: Int # Customer Reference Number
  sbi: Int # Single Business Identifier
  commsType: String # Type of the communication email, sms, etc.
  reference: String # Reference identifier for the communication
  commsAddresses: StringOrArray # Address (email, phone, etc.) for the communication
  sourceSystem: String # System that generated the communication
  emailReplyToId: String # Reply-to GovNOtify identifier for email communication
  statusDetails: JSONObject # Detailed status of the communication
  coorelationId: String # Correlation ID for tracking
  personalisation: JSONObject # Personalisation data for the GovNotify communication
}

# Enumeration for comms properties
enum commsEnum {
  ID # UUID of the comms event
  TIME # Date the event was created in database
  TYPE # Type of the message
  SOURCE # Source system
  SPECVERSION # Specification version
  DATACONTENTTYPE # Data content type
  DATE_CREATED # Date the event was created
  COMMS_MESSAGE # comms message object
  CRN # Customer Reference Number
  SBI # Single Business Identifier
  COMMS_TYPE # Type of the communication (default : email)
  REFERENCE # Reference identifier
  COMMS_ADDRESS # Communication address
  SOURCE_SYSTEM # Source system of the communication
  EMAIL_REPLY_TO_ID # Reply-to identifier for emails
  STATUS_DETAILS # Status details in JSON format
  COORELATION_ID # Correlation ID for tracking
  PERSONALISATION # Personalisation data
}
`

export default commsMessageTypeDefs
