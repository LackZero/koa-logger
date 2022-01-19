import request from 'supertest';
import chalk from 'chalk';
import appFunc from './app';
import { endLogo, startLogo, statusColorsMap } from '../src/config';

const firstLogPrefix = () => `  %s ${chalk.bold('%s')} %s`;
const secondLogPrefix = (status) => {
  const s = status.toString()[0] || '0';
  const color = statusColorsMap[s] || statusColorsMap[0];
  return `  %s ${chalk.bold('%s')} %s ${chalk[color]('%s')} %s %s`;
};

let app;
let logSpy;
describe('koaLogger', () => {
  beforeAll(() => {
    app = appFunc();
  });

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('测试一个请求 && console.log 是否被调用', async () => {
    const resp = await request(app.callback()).get('/200');
    expect(resp.status).toBe(200);
    expect(resp.text).toBe('Hello World');
    expect(logSpy).toHaveBeenCalled();
  });

  it('测试log打印日志', async () => {
    await request(app.callback()).get('/200');
    expect(logSpy).toHaveBeenNthCalledWith(1, firstLogPrefix(), startLogo, 'GET', '/200');
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      secondLogPrefix(200),
      endLogo,
      'GET',
      '/200',
      200,
      expect.anything(),
      '11B'
    );
  });
});
