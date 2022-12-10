'use strict';

const { db, users } = require('../src/models');
const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

let headChef;
let manager;

// Unsure if I should also add waitstaff due to them not having create function so i left them out

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

// I am unsure of the routing  due to the code using V1 and V2 and i didnt fully grasp what was going on before going back to class, there is a good chunk left to add to this file.

