export default {
  query: `query GetMetadata($key: metadataEnum!, $value: StringOrArray!) {
          getMetadata(key: $key, value: $value) {
            id
            dateCreated
            metadata {
              id
              data {
                sbi
                blobReference
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
