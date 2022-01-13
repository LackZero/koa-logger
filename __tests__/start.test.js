import request from 'supertest';
import appFunc from './app';

const app = appFunc();

describe('Koa Start Jest', () => {
  test('Hello world display', async () => {
    const resp = await request(app.callback()).get('/');
    expect(resp.status).toBe(200);
    expect(resp.text).toBe('Hello World');
  });

  test('Body Response', async () => {
    const resp = await request(app.callback()).get('/users');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ name: 'Tom' });
  });
});
