'use strict';

const savoryModel = (sequelize, DataTypes) => sequelize.define('savory', {
  item: { type: DataTypes.STRING, required: true },
  flavor: { type: DataTypes.STRING, required: true },
  price: { type: DataTypes.INTEGER, required: true },
});

module.exports = savoryModel;
