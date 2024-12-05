'use strict';
const {
  Model
} = require('sequelize');
const { getDuration } = require('../helpers/calculateDuration')

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {foreignKey: "UserId"})
      Comment.belongsTo(models.Post, {foreignKey: "PostId"})
    }

    get duration(){
      return getDuration(new Date(this.createdAt))
    }

  }
  Comment.init({
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    commentContent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};