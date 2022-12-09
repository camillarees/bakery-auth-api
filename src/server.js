'use strict';

require('dotenv').config();

const express = require('express');
const notFound = require('./error-handlers/404');
const logger = require('./middleware/logger');
const errorHandler = require('./error-handlers/500');


const authRouter = require('./auth/routes');
const customerRouter = require('./routes/customerRoute');
const employeeRouter = require('./routes/employeeRoute');

const app = express();

app.use(express.json());

app.use(logger);

app.use(authRouter);
app.use('/api/customerRoute', customerRouter);
app.use('/api/employeeRoute', employeeRouter);

app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server:app,
  start:port => {
    if(!port){
      throw new Error('missing port');
    }
    app.listen(port, () => console.log(`listening on ${port}`));
  },
};