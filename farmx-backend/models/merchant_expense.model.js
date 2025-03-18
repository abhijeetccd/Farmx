module.exports = (sequelize, DataTypes) => {
  const MerchantExpense = sequelize.define(
    "MerchantExpense",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "vendors",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "merchant_expenses",
      timestamps: true,
      underscored: true,
    }
  );

  MerchantExpense.associate = (models) => {
    MerchantExpense.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      as: "merchant",
    });
  };

  return MerchantExpense;
};
