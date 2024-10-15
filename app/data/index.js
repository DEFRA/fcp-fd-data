import { readdirSync } from 'fs'
import { basename, dirname, join } from 'path'
import { Sequelize, DataTypes } from 'sequelize'
import { fileURLToPath } from 'url'
import config from '../config/index.js'

const filename = fileURLToPath(import.meta.url)
console.log('filename', filename)
const directoryName = dirname(filename)
console.log('directoryName', directoryName)
const modelPath = join(directoryName, 'models')
console.log('modelPath', modelPath)
const db = {}
const sequelize = new Sequelize(config.databaseConfig.database, config.databaseConfig.username, config.databaseConfig.password, config.databaseConfig)

const files = readdirSync(modelPath)
  .filter(
    (file) => file.indexOf('.') !== 0 &&
    file !== basename(filename) &&
    file.slice(-3) === '.js'
  )
console.log(files)

await Promise.all(files.map(async file => {
  const model = await import(`./${file}`)
  if (!model.default) {
    return
  }

  const namedModel = model.default(sequelize, DataTypes)
  db[namedModel.name] = namedModel
}))

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
