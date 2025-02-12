const buildQuery = (mappedKey, values) => {
  const where = whereClause(mappedKey, values)
  return `SELECT * FROM "public"."commsEvent" AS "commsEvent" WHERE ${where}`
}

const whereClause = (mappedKey, values) => {
  const keys = mappedKey.split('.')
  if (keys.length === 1) {
    return `"commsMessage"->>'${mappedKey}' = '${values[0]}'`
  }
  return `"commsMessage"->'${keys[0]}'->'${keys[1]}' ?| ${valuesMap(values)} `
}

const valuesMap = values => {
  const mappedValues = values.map(val => `'${val}'`).join(', ')
  return `ARRAY[${mappedValues}]`
}

export default buildQuery
