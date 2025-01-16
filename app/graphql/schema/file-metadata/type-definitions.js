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
  id: String
  dateCreated: Timestamp
  metadata: metadataDetails
}

type metadataDetails {
  id: String
  data: metadata
  time: Timestamp
  type: String
  source: String
  specversion: String
  datacontenttype: String
}

type metadata {
  """ Single Business Identifier """
  sbi: Int
  """ Blob Reference """
  blobReference: String
}

""" Enumeration for file metadata """
enum fileMetadataEnum {

  """ Single Business Identifier """
  SBI

  """ Blob reference """
  BLOB_REFERENCE
}
`

export default typeDefinitions
