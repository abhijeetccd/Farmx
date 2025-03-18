module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "vendors",
          key: "id",
        },
      },
      merchant_vendor_id: {
        // New column
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null if not selling to merchant
        references: {
          model: "vendors",
          key: "id",
        },
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
        allowNull: false,
        defaultValue: 2,
      },
      deduction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
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
      expenses: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      final_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      payment_status: {
        type: DataTypes.ENUM("pending", "paid"),
        allowNull: false,
        defaultValue: "pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "transactions",
      timestamps: true,
      underscored: true,
    }
  );

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      as: "vendor",
    });
    Transaction.belongsTo(models.Vendor, {
      foreignKey: "merchant_vendor_id",
      as: "merchant",
    });
  };

  return Transaction;
};
