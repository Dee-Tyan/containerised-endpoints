import supertest from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import fakeTimers from '@sinonjs/fake-timers';
import app from '../src/app';

const balanceDbPath = path.join(__dirname, '../data/test.json');

const mockData = {
  name: 'Chibuzor',
  location: 'Abuja',
  balance: 300000,
  account: '94845152815',
  createdAt: '2022-04-06T20:46:51.904Z',
};

beforeAll(async () => {
  await fs.writeFile(balanceDbPath, JSON.stringify([mockData]));
});

afterAll(async () => {
  await fs.unlink(balanceDbPath);
});

describe('Bank App Test', () => {
  test('GET Request', () => {
    return supertest(app)
      .get('/balances')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body.data).toEqual([mockData]);
      });
  });
});
