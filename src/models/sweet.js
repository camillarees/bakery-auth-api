'use strict';

const sweetModel = (sequelize, DataTypes) => sequelize.define('sweet', {
  item: { type: DataTypes.STRING, required: true },
  flavor: { type: DataTypes.STRING, required: true },
  price: { type: DataTypes.INTEGER, required: true },
});

module.exports = sweetModel;
