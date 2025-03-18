"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First rename phone to phone_no
    await queryInterface.renameColumn("vendors", "phone", "phone_no");

    // Then add account_no column
    await queryInterface.addColumn("vendors", "account_no", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "phone_no", // This will place it after phone_no column
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First remove account_no column
    await queryInterface.removeColumn("vendors", "account_no");

    // Then rename phone_no back to phone
    await queryInterface.renameColumn("vendors", "phone_no", "phone");
  },
};
