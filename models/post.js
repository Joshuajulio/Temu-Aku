'use strict';
const {
  Model
} = require('sequelize');
const { getDuration } = require('../helpers/calculateDuration')
const { Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {foreignKey: "UserId"})
      Post.hasMany(models.Comment, {foreignKey: "PostId"})
      Post.hasMany(models.Like, {foreignKey: "PostId"})
      Post.belongsToMany(models.Tag, {through: models.PostTag, foreignKey: "PostId"})
    }

    // static async getAllPosts(){
    //   const includeClause = [
    //     {
    //       model: sequelize.models.User,
    //       attributes: ['id'],
    //       include: [
    //         {
    //           model: sequelize.models.Profile,
    //           attributes: ['fullname', 'picture'],
    //         },
    //       ]
    //     },
    //     {
    //       model: sequelize.models.Tag,
    //       attributes: ['tagName'],
    //     },
    //     {
    //       model: sequelize.models.Comment,
    //       attributes: ['commentContent', 'createdAt'],
    //       include: [
    //         {
    //           model: sequelize.models.User,
    //           attributes: ['id'],
    //           include: [
    //             {
    //               model: sequelize.models.Profile,
    //               attributes: ['fullname', 'picture'],
    //             },
    //           ]
    //         },
    //       ],
    //       separate: true,
    //       order: [['createdAt', 'DESC']]
    //     },
    //     {
    //       model: sequelize.models.Like,
    //       attributes: ['UserId'],
    //       include: [
    //         {
    //           model: sequelize.models.User,
    //           attributes: ['id'],
    //           include: [
    //             {
    //               model: sequelize.models.Profile,
    //               attributes: ['fullname', 'picture'],
    //             },
    //           ]
    //         }
    //       ]
    //     },
    //   ];

    //   const posts = await this.findAll({
    //     include: includeClause,
    //     order: [['createdAt', 'DESC']]
    //   },
    // )
    // return posts
    // }

    static async searchPosts(tag, query) {
      const whereClause = {};
      const includeClause = [
        {
          model: sequelize.models.User,
          attributes: ['id'],
          include: [
            {
              model: sequelize.models.Profile,
              attributes: ['fullname', 'picture'],
            },
          ]
        },
        {
          model: sequelize.models.Tag,
          attributes: ['tagName'],
        },
        {
          model: sequelize.models.Comment,
          attributes: ['commentContent', 'createdAt'],
          include: [
            {
              model: sequelize.models.User,
              attributes: ['id'],
              include: [
                {
                  model: sequelize.models.Profile,
                  attributes: ['fullname', 'picture'],
                },
              ]
            },
          ],
          separate: true,
          order: [['createdAt', 'DESC']]
        },
        {
          model: sequelize.models.Like,
          attributes: ['UserId'],
          include: [
            {
              model: sequelize.models.User,
              attributes: ['id'],
              include: [
                {
                  model: sequelize.models.Profile,
                  attributes: ['fullname', 'picture'],
                },
              ]
            }
          ]
        },
      ];
    
      if (tag && tag !== 'All' && tag !== '') {
        includeClause.push({
          model: sequelize.models.Tag,
          where: { tagName: tag },
          attributes: []
        });
      }
    
      if (query && query !== '') {
        whereClause.content = { [Op.iLike]: `%${query}%` };
      }
    
      const posts = await this.findAll({
        where: whereClause,
        include: includeClause,
        order: [['createdAt', 'DESC']]
      });
    
      return posts;
    }

    get duration(){
      return getDuration(new Date(this.createdAt))
    }
    
  }
  Post.init({
    UserId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};