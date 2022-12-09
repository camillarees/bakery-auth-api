'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');
const aclPermissions = require('./middleware/acl');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userData = await users.create(req.body);
    const output = {
      user: userData,
      token: userData.token,
    };
    res.status(201).json(output);
  } catch(e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, aclPermissions('delete'), async (req, res, next) => {
  const userData = await users.findAll({});
  const list = userData.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('You are in the secret area');
});

module.exports = authRouter;