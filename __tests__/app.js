import Koa from 'koa';
import koaBody from 'koa-body';
import Router from '@koa/router';
import { koaLogger } from '../src';
// import { koaLogger } from '../lib';

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

  router.post('/post-200', (ctx) => {
    ctx.body = ctx.request.body;
  });

  app.use(koaLogger(options));

  app.use(koaBody());

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
