import db from '../../../data/index.js'

const commsEventsBySbi = async (_, { sbi }) => {
  return await db.commsEvent.findAll({
    where: db.Sequelize.where(
      db.Sequelize.cast(db.Sequelize.json('commsMessage.data.sbi'), 'text'),
      sbi.toString()
    )
  })
}

export default commsEventsBySbi
