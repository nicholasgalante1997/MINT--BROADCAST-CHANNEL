import chalk from 'chalk';

class Logger {
  colors = {
    info: '#023e8a',
    warn: '#e9c46a',
    success: '#2a9d8f',
    error: '#e63946'
  };

  info = (message) => {
    if (typeof message === 'object' || typeof message === 'function') {
      console.log(JSON.stringify(message, null, 2));
    } else {
      console.log(
        chalk.hex(this.colors.info)('[INFO]:') + ' ' + chalk.bold(`${message}`)
      );
    }
  };

  warn = (message) => {
    if (typeof message === 'object' || typeof message === 'function') {
      console.warn(JSON.stringify(message, null, 2));
    } else {
      console.warn(
        chalk.hex(this.colors.warn)('[WARN]:') + ' ' + chalk.bold(`${message}`)
      );
    }
  };

  error = (message) => {
    if (typeof message === 'object' || typeof message === 'function') {
      console.error(JSON.stringify(message, null, 2));
    } else {
      console.error(
        chalk.hex(this.colors.error)('[ERROR]:') +
          ' ' +
          chalk.bold(`${message}`)
      );
    }
  };

  success = (message) => {
    if (typeof message === 'object' || typeof message === 'function') {
      console.log(JSON.stringify(message, null, 2));
    } else {
      console.log(
        chalk.hex(this.colors.success)('[SUCCESS]:') +
          ' ' +
          chalk.bold(`${message}`)
      );
    }
  };
}

export default new Logger();
