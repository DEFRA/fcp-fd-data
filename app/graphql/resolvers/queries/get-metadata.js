import db from '../../../data/index.js'
import enumMap from '../../schema/file-metadata/enum-map.js'

const getMetadata = async (_, { key, value }) => {
  const mappedKey = enumMap[key]
  value = value.toString()

  console.log('Key:', key)
  console.log('Mapped Key:', mappedKey)
  console.log('Value:', value)

  const result = await db.fileMetadata.findAll({
    where: { [`metadata.${mappedKey}`]: value }
  })

  console.log('Query Result:', result)

  return result
}

export default getMetadata
