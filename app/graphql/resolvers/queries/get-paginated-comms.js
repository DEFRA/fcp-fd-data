import { Op } from 'sequelize'
import db from '../../../data/index.js'
import commsEnumMap from '../../schema/comms-message/comms-enum-map.js'
import { encodeCursor, decodeCursor } from './cursor-utils.js'

const getCommsEventByPaginatedProperty = async (_, { key, value, first, after, last, before }) => {
  console.log('Received Parameters:', { first, last, after, before })

  const mappedKey = commsEnumMap[key]
  if (!mappedKey) {
    throw new Error(`Invalid key: ${key}`)
  }

  value = value.toString() // Normalize the value as a string

  let direction = 'ASC' // Default to ascending
  let limit

  if (last) {
    limit = last
    direction = 'DESC' // Descending for "last" pagination
  }

  // Decode cursors (if provided)
  const startCursor = after ? decodeCursor(after) : null
  const endCursor = before ? decodeCursor(before) : null

  console.log('Decoded startCursor:', startCursor)
  console.log('Decoded endCursor:', endCursor)

  let cursorValue = null
  let cursorId = null

  // Set cursor values based on pagination type
  if (startCursor) {
    cursorValue = startCursor.value
    cursorId = startCursor.id
  } else if (endCursor) {
    cursorValue = endCursor.value
    cursorId = endCursor.id
  }

  console.log('cursorValue:', cursorValue)
  console.log('cursorId:', cursorId)

  // Create where conditions for the query
  const whereConditions = {
    [Op.or]: [
      { [`commsMessage.${mappedKey}`]: value },
      { [`commsMessage.${mappedKey}`]: { [Op.contains]: JSON.stringify([value]) } }
    ]
  }

  // Log before applying cursor filter
  console.log('Where Conditions before cursor filter:', whereConditions)
  let options = {
    where: whereConditions,
    limit,
    order: [['id', direction]] // Assuming 'id' is the primary key
  }

  if (last) {
    options = {
      where: whereConditions,
      limit: 2,
      order: [['id', 'DESC']] // Fetch the last 2 records
    }
  }
  if (after) {
    const decodedCursor = decodeCursor(after)
    const cursorId = decodedCursor.id
    options = {
      where: {
        ...whereConditions,
        id: { [Op.gt]: cursorId } // Fetch records after the provided cursor
      },
      limit,
      order: [['id', 'ASC']] // Assuming 'id' is the primary key
    }
  }

  if (before) {
    const decodedCursor = decodeCursor(before)
    const cursorId = decodedCursor.id
    options = {
      where: {
        ...whereConditions,
        id: { [Op.lt]: cursorId } // Fetch records before the provided cursor
      },
      limit,
      order: [['id', 'DESC']] // Assuming 'id' is the primary key
    }
  }

  // Fetch events based on the conditions and limit
  const events = await db.commsEvent.findAll(options)

  console.log('Fetched Events:', events)

  // Map fetched events to the pagination structure
  const edges = events.map(event => {
    const keys = mappedKey.split('.')
    let value = event.commsMessage

    keys.forEach(key => {
      value = value?.[key]
    })

    const cursor = encodeCursor({
      key: `commsMessage.${mappedKey}`,
      value,
      id: event.id
    })

    return {
      batchOf: event,
      cursor
    }
  })

  // Page info (next/previous pages)
  const hasNextPage = events.length === limit
  const hasPreviousPage = events.length === limit

  const pageInfo = {
    hasNextPage,
    hasPreviousPage,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
  }

  return {
    Node: edges,
    pageInfo
  }
}

export default getCommsEventByPaginatedProperty
