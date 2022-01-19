# koa-logger

## 安装

```bash
$ npm i @lack-org/koa-logger
```

## 基本用法

```js
import Koa from 'koa';
import { koaLogger } from '@lack-org/koa-logger';

const app = new Koa();

app.use(koaLogger(options));
```

## 参数

| 参数        | 说明           | 类型       | 默认值        |
| :---------- | :------------- | :--------- | :------------ |
| transporter | 自定义打印工具 | `Function` | `console.log` |

## CHANGELOG

[CHANGELOG.md](https://github.com/LackZero/koa-logger/blob/main/CHANGELOG.md)

## TODOLIST

[TODO](https://github.com/LackZero/koa-logger/projects/1)

## Contributing

如何贡献代码查看 [CONTRIBUTING](https://github.com/LackZero/koa-logger/blob/main/CONTRIBUTING.md)
