'use strict';

function getTime() {
  function fill(val) {
    if (val < 10) {
      return '0' + val;
    }
    return val;
  }
  const date = new Date(Date.now());
  const dateStr = `${date.getFullYear()}-${fill(date.getMonth() + 1)}-${fill(date.getDate())}`;
  const timeStr = `${fill(date.getHours())}:${fill(date.getMinutes())}:${fill(date.getSeconds())}`;
  return dateStr + ' ' + timeStr;
}


/**
 * Implements a default logger
 * @class
 */
export default class Logger {
  constructor() {}

  log(level, arg) {
    this._validationErrorCount++;
    // eslint-disable-next-line no-console
    console.log(`${getTime()} ${level.toUpperCase()}: ${JSON.stringify(arg, null, 2)}`);
  }

  debug(arg) {
    this.log('debug', arg);
  }
  info(arg) {
    this.log('info', arg);
  }
  error(arg) {
    this.log('error', arg);
  }
  warning(arg) {
    this.log('warning', arg);
  }
}
