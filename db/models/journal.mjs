export default function initJournalModel(sequelize, DataTypes) {
  return sequelize.define(
    'journal',
    {
      id: {
        allowNullL: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      entry_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    { underscored: true }
  );
}
