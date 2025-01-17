import db from '../../../data/index.js'
import enumMap from '../../schema/file-metadata/enum-map.js'

const getMetadata = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  value = value.toString()

  const response = await db.fileMetadata.findAll({
    where: { [`metadata.${mappedKey}`]: value }
  })

  const mappedResponse = response.map((element) => {
    return {
      id: element.dataValues.id,
      dateCreated: element.dataValues.dataCreated,
      metadata: {
        id: element.dataValues.metadata.id,
        data: {
          sbi: element.dataValues.metadata.data.sbi,
          blobReference: element.dataValues.metadata.data.blobReference
        },
        time: element.dataValues.metadata.time,
        type: element.dataValues.metadata.type,
        source: element.dataValues.metadata.source,
        specversion: element.dataValues.metadata.specversion,
        datacontenttype: element.dataValues.metadata.datacontenttype
      }
    }
  })

  return mappedResponse
}

export default getMetadata
