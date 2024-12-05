'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.Post, {foreignKey: "PostId"})
      Like.belongsTo(models.User, {foreignKey: "UserId"})
    }
    static async getLikesData(userId) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const likes = await Like.findAll({
          include: [{
              model: sequelize.models.Post,
              where: { UserId: userId },
              attributes: []
          }],
          where: {
              createdAt: { [Op.gte]: sevenDaysAgo }
          },
          attributes: [
              [sequelize.fn('date', sequelize.col('Like.createdAt')), 'date'],
              [sequelize.fn('count', sequelize.col('Like.id')), 'count']
          ],
          group: [sequelize.fn('date', sequelize.col('Like.createdAt'))],
          order: [[sequelize.fn('date', sequelize.col('Like.createdAt')), 'ASC']]
      });
  
      const dateLabels = [];
      const likeCounts = [];
      for (let i = 6; i >= 0; i--) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dateString = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
          dateLabels.push(dateString);
          const likeData = likes.find(like => like.dataValues.date === date.toISOString().split('T')[0]);
          likeCounts.push(likeData ? parseInt(likeData.dataValues.count) : 0);
      }
  
      return { dateLabels, likeCounts };
    }
  }
  Like.init({
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};