module.exports = (sequelize, DataTypes) => {
  const MerchantTransaction = sequelize.define(
    "MerchantTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "transactions",
          key: "id",
        },
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "vendors",
          key: "id",
        },
      },
      farmer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bags: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      deduction_per_bag: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 2.0,
      },
      deduction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      net_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      remarks: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "merchant_transactions",
      timestamps: true,
      underscored: true,
    }
  );

  MerchantTransaction.associate = (models) => {
    MerchantTransaction.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      as: "merchant",
    });
    MerchantTransaction.belongsTo(models.Transaction, {
      foreignKey: "transaction_id",
      as: "farmer_transaction",
      onDelete: "CASCADE",
    });
  };

  return MerchantTransaction;
};
