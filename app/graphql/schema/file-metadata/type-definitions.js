const typeDefinitions = `#graphql
""" Scalars for custom data types """
scalar JSON
scalar Timestamp
scalar JSONObject
scalar StringOrArray

""" Available query operations """
type Query {
  """
  GET metadata filtered by a specific property and value
  """
  getMetadata(key: fileMetadataEnum!, value: StringOrArray!): [FileMetadata]
}

""" Metadata received """
type FileMetadata {
  """ Unique identifier for the file metadata """
  id: String

  """ Date and time when metadata has been saved in fd-data database """
  dateCreated: Timestamp

  """ Details of the metadata """
  metadata: metadataDetails
}

""" Details of the metadata """
type metadataDetails {
  """ Unique identifier for the metadata """
  id: String

  """ Structured business data related to the metadata """
  data: metadata

  """ Time of the metadata """
  time: Timestamp

  """ Type of the metadata """
  type: String

  """ Source system of the metadata """
  source: String

  """ Specification version of the metadata (Cloud Events format) """
  specversion: String

  """ Content type of the metadata data """
  datacontenttype: String
}

""" Data structure for metadata content """
type metadata {
  """ Single Business Identifier """
  sbi: String

  """ Blob Reference """
  blobReference: String
}

""" Enumeration for file metadata """
enum fileMetadataEnum {
  """ Single Business Identifier """
  SBI

  """ Blob Reference """
  BLOB_REFERENCE
}
`

export default typeDefinitions
