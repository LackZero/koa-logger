import { koaLogger } from '../src';

describe('Koa-Logger', () => {
  it('hello world display', async () => {
    koaLogger && koaLogger();
    expect(1).toBe(1);
  });
});
