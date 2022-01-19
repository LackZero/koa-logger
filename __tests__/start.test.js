import request from 'supertest';
import appFunc from './app';

const app = appFunc();

describe('Koa Start Jest', () => {
  it('Hello world display', async () => {
    const resp = await request(app.callback()).get('/');
    expect(resp.status).toBe(200);
    expect(resp.text).toBe('Hello World');
  });

  it('GET Body Response', async () => {
    const resp = await request(app.callback()).get('/users');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ name: 'Tom' });
  });

  it('POST Body Response', async () => {
    const resp = await request(app.callback())
      .post('/post-200')
      .send({ name: 'JOHN' })
      .set('Accept', 'application/json');
    expect(resp.body).toEqual({ name: 'JOHN' });
  });
});
