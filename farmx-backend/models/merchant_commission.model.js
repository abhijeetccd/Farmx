module.exports = (sequelize, DataTypes) => {
  const MerchantCommission = sequelize.define(
    "MerchantCommission",
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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "merchant_commissions",
      underscored: true,
    }
  );

  MerchantCommission.associate = (models) => {
    MerchantCommission.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      as: "merchant",
    });
  };

  return MerchantCommission;
};
