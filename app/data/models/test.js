export default (sequelize, DataTypes) => {
  return sequelize.define('test', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: DataTypes.STRING
  },
  {
    tableName: 'test',
    freezeTableName: true,
    timestamps: false
  })
}
