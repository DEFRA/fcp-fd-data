export default (sequelize, DataTypes) => {
  return sequelize.define('commsEvent', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
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
}
