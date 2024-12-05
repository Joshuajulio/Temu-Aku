'use strict';
const fs = require("fs")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = JSON.parse(fs.readFileSync("./data/post.json", "utf-8")).map(el => {
      delete el.id
      return {
        ...el,
        createdAt: new Date(el.createdAt),
        updatedAt: new Date()
      }
    })
    await queryInterface.bulkInsert("Posts", data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Posts", null, {})
  }
};
