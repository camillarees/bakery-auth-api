'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const savoryModel = require('./savory');
const sweetModel = require('./sweet');
const userModel = require('../auth/models/users');
const Collection = require('./data-collection');


const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL);
const savory = savoryModel(sequelize, DataTypes);
const sweet = sweetModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  savory: new Collection(savory),
  sweet: new Collection(sweet),
  users,
};

