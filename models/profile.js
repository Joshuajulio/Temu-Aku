'use strict';
const {
  Model
} = require('sequelize');
const _ = require('lodash')
const { Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey: "UserId"})
    }

    get age(){
      return new Date().getFullYear() - new Date(this.dob).getFullYear()
    }

    get favourites(){
      return [this.favorite1, this.favorite2, this.favorite3]
    }

    calculateSimilarity(arr1, arr2) {
      const commonElements = _.intersection(arr1, arr2);
      return commonElements.length / arr1.length;
    }

    matchPercentage(arr1){
      const similarity = Math.round(this.calculateSimilarity(this.favourites, arr1)*100, 1);
      return similarity
    }

    static async findMatch(userId){
      const user = await this.findOne({where: {UserId: userId}})
      const profiles = await this.findAll({ where: { UserId: { [Op.ne]: userId } } })
      const similarity = profiles.map(profile => {
        profile.similarity = profile.matchPercentage(user.favourites)
        return profile
      })
      console.log(similarity)
      return similarity.sort((a, b) => b.similarity - a.similarity)
    }

  }
  Profile.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        async isUnique(value) {
          const profile = await Profile.findOne({where: {UserId: value}})
          if (profile) {
            throw new Error("User already has a profile")
          }
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Fullname is required"},
        notEmpty: {msg: "Fullname is required"},
      }
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Picture is required"},
        notEmpty: {msg: "Picture is required"},
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Location is required"},
        notEmpty: {msg: "Location is required"},
      }
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {msg: "Date of Birth is required"},
        notEmpty: {msg: "Date of Birth is required"},
      }
    },
    favorite1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Favorite 1 is required"},
        notEmpty: {msg: "Favorite 1 is required"},
      }
    },
    favorite2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Favorite 2 is required"},
        notEmpty: {msg: "Favorite 2 is required"},
      }
    },
    favorite3: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Favorite 3 is required"},
        notEmpty: {msg: "Favorite 3 is required"},
      }
    },
    motto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};