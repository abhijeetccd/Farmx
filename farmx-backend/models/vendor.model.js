module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    "Vendor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("farmer", "merchant"),
        allowNull: false,
      },
    },
    {
      tableName: "vendors",
      timestamps: true,
      underscored: true,
    }
  );

  Vendor.associate = (models) => {
    Vendor.hasMany(models.Transaction, {
      foreignKey: "vendor_id",
      as: "transactions",
    });
  };

  return Vendor;
};
