class CommsEventDataSource {
  constructor (db) {
    if (!db) {
      throw new Error('Database instance is required')
    }
    this.db = db
  }

  async findEventByProperty (mappedKey, value) {
    return this.db.commsEvent.findAll({
      where: { [`commsMessage.${mappedKey}`]: value }
    })
  }

  async findEventById (id) {
    return this.db.commsEvent.findByPk(id)
  }
}

export default CommsEventDataSource
