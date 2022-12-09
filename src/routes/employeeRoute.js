'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../auth/middleware/bearer');
const aclPermissions = require('../auth/middleware/acl');

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

router.get('/:model', bearerAuth, aclPermissions('read'), handleGetAll);
router.get('/:model/:id', bearerAuth, aclPermissions('read'), handleGetOne);
router.post('/:model', bearerAuth, aclPermissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, aclPermissions('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, aclPermissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allData = await req.model.get();
  res.status(200).json(allData);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theData = await req.model.get(id);
  res.status(200).json(theData);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newData = await req.model.create(obj);
  res.status(201).json(newData);
}

async function handleUpdate(req, res) {
  const id = req.param.id;
  const obj = req.body;
  let updateData = await req.model.update(id, obj);
  res.status(200).json(updateData);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deleteData = await req.model.delete(id);
  res.status(200).json(deleteData);
}

module.exports = router;
