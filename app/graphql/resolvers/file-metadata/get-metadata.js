import db from '../../../data/index.js'
import enumMap from '../../schema/file-metadata/enum-map.js'
import { Op } from 'sequelize'

const getMetadata = async (_, { key, value }) => {
  const mappedKey = enumMap[key]

  const values = Array.isArray(value) ? value.map(String) : [String(value)]

  const metadataRecords = await db.fileMetadata.findAll({
    where: {
      [`metadata.${mappedKey}`]: {
        [Op.in]: values
      }
    }
  })

  return metadataRecords.map(record => ({
    id: record.dataValues.id,
    dateCreated: record.dataValues.dateCreated,
    metadata: {
      id: record.dataValues.metadata.id,
      data: {
        sbi: record.dataValues.metadata.data.sbi,
        blobReference: record.dataValues.metadata.data.blobReference
      },
      time: record.dataValues.metadata.time,
      type: record.dataValues.metadata.type,
      source: record.dataValues.metadata.source,
      specversion: record.dataValues.metadata.specversion,
      datacontenttype: record.dataValues.metadata.datacontenttype
    }
  }))
}

export default getMetadata
