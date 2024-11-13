const number36 = 36
export default (sequelize, DataTypes) => {
  return sequelize.define('commsEvent', {
    id: {
      type: DataTypes.STRING(number36),
      primaryKey: true,
      allowNull: false
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
}
