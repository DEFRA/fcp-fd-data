export default (sequelize, DataTypes) => {
  return sequelize.define('fileMetadata', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  },
  {
    tableName: 'fileMetadata',
    freezeTableName: true,
    timestamps: false
  })
}
