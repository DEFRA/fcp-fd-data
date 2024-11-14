import { GraphQLEnumType } from 'graphql'

const CommsEnum = new GraphQLEnumType({
  name: 'commsEnum',
  values: {
    CRN: { value: 'commsMessage.commsEvent.data.crn' },
    SBI: { value: 'commsMessage.commsEvent.data.sbi' },
    COMMS_TYPE: { value: 'data.commsType' },
    REFERENCE: { value: 'data.reference' },
    COMMS_ADDRESS: { value: 'data.commsAddress' },
    SOURCE_SYSTEM: { value: 'data.sourceSystem' },
    EMAIL_REPLY_TO_ID: { value: 'data.emailReplyToId' },
    STATUS_DETAILS: { value: 'data.statusDetails' },
    COORELATION_ID: { value: 'data.coorelationId' },
    PERSONALISATION: { value: 'data.personalisation' },
    DATA: { value: 'data' },
    TIME: { value: 'time' },
    TYPE: { value: 'type' },
    SOURCE: { value: 'source' },
    SPECVERSION: { value: 'specversion' },
    DATACONTENTTYPE: { value: 'datacontenttype' },
    DATE_CREATED: { value: 'dateCreated' },
    COMMS_MESSAGE: { value: 'commsMessage' },
    ID: { value: 'id' }
  }
})
export default CommsEnum
