'use strict';

const base64 = require('base-64');
const { users } = require('../../models');

module.exports = async (req, res, next) => {

  function _authError() {
    next('Invalid Login');
  }

  if(!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, password] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(user, password);
    next();
  } catch(e) {
    _authError();
  }
};