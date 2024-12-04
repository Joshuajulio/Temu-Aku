'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: {tableName: "Users"},
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      fullname: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      favorite1: {
        type: Sequelize.STRING
      },
      favorite2: {
        type: Sequelize.STRING
      },
      favorite3: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles');
  }
};