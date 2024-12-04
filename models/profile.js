'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    UserId: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    picture: DataTypes.STRING,
    location: DataTypes.STRING,
    dob: DataTypes.DATE,
    favorite1: DataTypes.STRING,
    favorite2: DataTypes.STRING,
    favorite3: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};