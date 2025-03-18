module.exports = (sequelize, DataTypes) => {
  const MerchantPayment = sequelize.define(
    "MerchantPayment",
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
      type: {
        type: DataTypes.ENUM("नावे", "जमा"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // payment_mode: {
      //   type: DataTypes.ENUM("cash", "cheque", "upi", "bank_transfer"),
      //   allowNull: true,
      // },
      // remarks: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
    },
    {
      tableName: "merchant_payments",
      underscored: true,
    }
  );

  MerchantPayment.associate = (models) => {
    MerchantPayment.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      as: "merchant",
    });
  };

  return MerchantPayment;
};
