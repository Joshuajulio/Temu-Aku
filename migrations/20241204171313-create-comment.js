'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
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
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: {tableName: "Posts"},
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      commentContent: {
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
    await queryInterface.dropTable('Comments');
  }
};