import util from 'util';
import chalk from 'chalk';
import counterFunc from 'passthrough-counter';
import bytes from 'bytes';
import {
  closeLogo, endLogo, errorLogo, startLogo, statusColorsMap
} from '../config';

// eslint-disable-next-line func-names
function handlePrintFunc(transporter) {
  return (...args) => {
    // 类似 printf 的格式字符串
    const string = util.format(...args);
    if (transporter) {
      transporter(string);
    } else console.log(...args);
  };
}

const handleBodyStr = (ctx) => (ctx.request.method === 'GET' ? '' : JSON.stringify(ctx.request.body));

const formatTime = (time) => {
  const unit = time < 1000 ? 'ms' : 's';
  const n = time < 1000 ? time : Math.round(time);
  return n.toLocaleString('en') + unit;
};
/**
 * @desc 得到返回结果后去记录数据
 * @param print
 * @param ctx
 * @param start
 * @param length
 * @param err
 * @param event
 */
const handleResponseLog = (print, ctx, start, length, err, event) => {
  // 总耗时
  const ms = formatTime(Date.now() - start);
  const status = err ? err.status || 500 : ctx.status || 404;
  const s = status.toString()[0] || '0';
  const color = statusColorsMap[s] || statusColorsMap[0];

  // eslint-disable-next-line no-nested-ternary
  const printLength = [204, 205, 304].includes(status)
    ? ''
    : length === null
      ? '-'
      : bytes(length, {});

  // eslint-disable-next-line no-nested-ternary
  const logo = err ? chalk.red(errorLogo) : event === 'close' ? chalk.yellow(closeLogo) : endLogo;

  print(
    `  %s ${chalk.bold('%s')} %s ${chalk[color]('%s')} %s %s`,
    logo,
    ctx.request.method,
    ctx.request.url,
    status,
    ms,
    printLength
  );
};
/**
 * @desc 日志记录
 * @param {object} options 参数列表
 * @param {function} [options.transporter] 自定义打印 默认是console
 */
function logger(options = {}) {
  const print = handlePrintFunc(options.transporter);
  return async (ctx, next) => {
    // 响应开始时间
    const start = Date.now();
    const bodyStr = handleBodyStr(ctx);
    try {
      // 控制台打印信息，也可用console.log
      print(
        `  %s ${chalk.bold('%s')} %s %s`,
        startLogo,
        ctx.request.method,
        ctx.request.url,
        bodyStr
      );

      await next();

      const {
        body,
        response: { length }
      } = ctx;
      let counter;
      // 如果返回的数据可读流，计算流的长度
      if (length === null && body && body.readable) {
        ctx.body = body.pipe((counter = counterFunc())).on('error', ctx.onerror);
      }
      // 打印响应日志
      handleResponseLog(print, ctx, start, counter ? counter.length : length, null);
    } catch (error) {
      // 打印错误日志
      handleResponseLog(print, ctx, start, null, error);
      // 扔出错误事件
      throw error;
    }
  };
}

export default logger;
