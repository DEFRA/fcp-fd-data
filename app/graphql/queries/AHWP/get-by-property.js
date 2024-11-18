import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'

const commsByProperty = async (_, { key, value }) => {
  const mappedKey = commsEnumMap[key]

  if (!isNaN(value)) {
    value = parseInt(value)
  }
  const query = db.sequelize.query(
    `
    SELECT "id", "dateCreated", "commsMessage" 
    FROM "public"."commsEvent" AS "commsEvent"
    WHERE CAST(("commsMessage"#>>'{${mappedKey}}') AS TEXT) = '${value}';
    `,
    {
      replacements: { value },
      type: db.Sequelize.QueryTypes.SELECT
    }
  )

  try {
    const result = await query
    return result
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}

export default commsByProperty
