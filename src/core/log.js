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

// 移除，不再使用
// eslint-disable-next-line no-unused-vars
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
  // 从异常err中获取响应的状态码
  // 根据不同状态码区间，1xx、2xx、3xx、4xx、5xx，映射选择不用颜色输出加以区分
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

  // 输出：请求方法、请求url，状态码、请求响应时间、响应内容大小
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
 * @param {object} [options] 参数
 * @param {function} [options.transporter] 自定义打印 默认是console
 */
function logger(options = {}) {
  const print = handlePrintFunc(options.transporter);
  return async (ctx, next) => {
    // 响应开始时间
    const start = Date.now();
    try {
      // 控制台打印信息，也可用console.log
      print(`  %s ${chalk.bold('%s')} %s`, startLogo, ctx.request.method, ctx.request.url);

      await next();
      const {
        body,
        response: { length }
      } = ctx;
      let counter;
      // 如果返回的数据（ctx.body）可读流，借助 passthrough-counter计算stream的buffer length
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
