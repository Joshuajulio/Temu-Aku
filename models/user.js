'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
const zxcvbn = require('zxcvbn')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey: "UserId"})
      User.hasMany(models.Post, {foreignKey: "UserId"})
      User.hasMany(models.Comment, {foreignKey: "UserId"})
      User.hasMany(models.Like, {foreignKey: "UserId"})
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {msg: "Email is required"},
        notEmpty: {msg: "Email is required"},
        //check if email is email format
        isEmail: {msg: "Email is not valid"},
        //check if email is already exist
        async isUnique(value) {
          const user = await User.findOne({where: {email: value}})
          if (user) {
            throw new Error("Email already exist")
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Password is required"},
        notEmpty: {msg: "Password is required"},
        //check password length min 8
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters and contain at least 2 of the following: uppercase, lowercase, number, symbol"
        },
        //check password is strong using zxcvbn
        isStrongPassword(value) {
          const result = zxcvbn(value)
          if (result.score < 2) {
            throw new Error("Password must be at least 8 characters and contain at least 2 of the following: uppercase, lowercase, number, symbol")
          }
        }
      }
    },
    admin: {
      type: DataTypes.BOOLEAN
    }
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        user.admin = false
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};