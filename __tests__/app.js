import Koa from 'koa';
import Router from '@koa/router';
import { koaLogger } from '../src';

export default function start(options) {
  const app = new Koa();
  const router = new Router();

  router.get('/', (ctx) => {
    ctx.body = 'Hello World';
  });

  router.get('/users', (ctx) => {
    ctx.body = { name: 'Tom' };
  });

  router.get('/200', (ctx) => {
    ctx.body = 'Hello World';
  });

  app.use(koaLogger(options));
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
