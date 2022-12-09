'use strict';

const express = require('express');
const dataModules = require('../models');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);

async function handleGetAll(req, res) {
  let allData = await req.model.get();
  res.status(200).json(allData);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theData = await req.model.get(id);
  res.status(200).json(theData);
}

module.exports = router;
