'use strict';

const { db, users } = require('../src/models');
const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

let headChef;
let manager;
let waitStaff;

beforeAll( async () => {
  await db.sync();
  headChef = await users.create({
    username: 'headChef',
    password: 'pass',
    role: 'headChef',
  });
  manager = await users.create({
    username: 'manager',
    password: 'pass',
    role: 'manager',
  });
  waitStaff = await users.create({
    username: 'waitStaff',
    password: 'pass',
    role: 'waitStaff',
  });
});

afterAll( async () => {
  await db.drop();
});

describe('API / Auth Server Integration', () => {

  it('handles invalid requests', async () => {
    const response = await request.get('/foo');

    expect(response.status).toEqual(404);
  });
});

it('allows employee create for sweet items for headChef and manager', async () => {
  let response = await request.post('/api/employeeRoute/sweet').send({
    item: 'muffin',
    flavor: 'blueberry',
    price: 3,
  }).set('Authorization', `Bearer ${headChef.token, manager.token}`);
  expect(response.status).toBe(201);
  expect(response.body.item).toEqual('muffin');
});

it('allows employee create for savory items for headChef and manager', async () => {
  let response = await request.post('/api/employeeRoute/savory').send({
    item: 'bagel',
    flavor: 'everything',
    price: 3,
  }).set('Authorization', `Bearer ${headChef.token, manager.token}`);

  expect(response.status).toBe(201);
  expect(response.body.item).toEqual('bagel');
});

it('allows customer read access for sweet items', async () => {
  let response = await request.get('/api/customerRoute/sweet');

  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body[0].item).toEqual('muffin');
});

it('allows customer read access for savory items', async () => {
  let response = await request.get('/api/customerRoute/savory');

  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body[0].item).toEqual('bagel');
});

it('allows employee read access for sweet items', async () => {
  let response = await request.get('/api/employeeRoute/sweet').set('Authorization', `Bearer ${waitStaff.token}`);
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body[0].item).toEqual('muffin');
});

it('allows employee read access for savory items', async () => {
  let response = await request.get('/api/employeeRoute/savory').set('Authorization', `Bearer ${waitStaff.token}`);
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body[0].item).toEqual('bagel');
});

it('allows customer read one access for sweet items', async () => {
  let response = await request.get('/api/customerRoute/sweet/1');
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body.item).toEqual('muffin');
});

it('allows customer read one access for savory items', async () => {
  let response = await request.get('/api/customerRoute/savory/1');
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body.item).toEqual('bagel');
});

it('allows employee read one access for sweet items', async () => {
  let response = await request.get('/api/employeeRoute/sweet/1').set('Authorization', `Bearer ${waitStaff.token}`);
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body.item).toEqual('muffin');
});

it('allows employee read one access for savory items', async () => {
  let response = await request.get('/api/employeeRoute/savory/1').set('Authorization', `Bearer ${waitStaff.token}`);
  // console.log('----------read test', writerUser);
  expect(response.status).toBe(200);
  expect(response.body.item).toEqual('bagel');
});

it('restricts employee sweet items create for waitStaff', async () => {
  let response = await request.put('/api/employeeRoute/sweet/2').send({
    item: 'pie',
    flavor: 'cherry',
    price: 10,
  }).set('Authorization', `Bearer ${waitStaff.token}`);

  let errorObject = JSON.parse(response.text);
  expect(response.status).toBe(500);
  expect(errorObject.message).toEqual('Access Denied');
});


it('allows employee sweet items update for waitStaff, headChef, and manager', async () => {
  let response = await request.put('/api/employeeRoute/sweet/2').send({
    item: 'pie',
    flavor: 'wildberry',
    price: 10,
  }).set('Authorization', `Bearer ${manager.token, headChef.token, waitStaff.token}`);

  expect(response.status).toBe(200);
  expect(response.body.item).toEqual('pie');
});

it('allows employee sweet items delete for headChef and manager', async () => {
  let response = await request.delete('/api/employeeRoute/sweet/1')
    .set('Authorization', `Bearer ${manager.token, headChef.token}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(1);
});

it('allows employee savory items delete for headChef and manager', async () => {
  let response = await request.delete('/api/employeeRoute/savory/1')
    .set('Authorization', `Bearer ${manager.token, headChef.token}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(1);
});

it('restricts employee sweet items delete by waitStaff', async () => {
  let response = await request.delete('/api/employeeRoute/sweet/2').set('Authorization', `Bearer ${waitStaff.token}`);
  let errorObject = JSON.parse(response.text);

  expect(response.status).toBe(500);
  expect(errorObject.message).toEqual('Access Denied');
});

it('restricts employee savory items delete by waitStaff', async () => {
  let response = await request.delete('/api/employeeRoute/savory/2').set('Authorization', `Bearer ${waitStaff.token}`);
  let errorObject = JSON.parse(response.text);

  expect(response.status).toBe(500);
  expect(errorObject.message).toEqual('Access Denied');
});
