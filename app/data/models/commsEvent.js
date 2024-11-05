import { DataTypes } from 'sequelize'

const defineCommsEvent = (sequelize) => {
  const commsEvent = sequelize.define('commsEvent', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false
    },
    commsMessage: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  },
  {
    tableName: 'commsEvent',
    freezeTableName: true,
    timestamps: false
  })

  return commsEvent
}

export default defineCommsEvent
