import puppeteer, { Browser, Page } from 'puppeteer';
import chalk from 'chalk';
import ora from 'ora';

import {
  Config,
  ResponseMessage,
} from './types/types';

const createUrl = (protocol: string, host: string, port: string): string =>
  `${protocol}://${host}:${port}`;

const checkForErrors = (browser: Browser, url: string) => async (path: string) => {
  const page: Page = await browser.newPage();
  const responseMessage: ResponseMessage = {
    path,
    warnings: [],
    status: null,
    exceptions: [],
  };

  page.on('pageerror', (error) => {
    responseMessage.exceptions.push(error);
  });

  page.on('response', (response) => {
    responseMessage.status = response.status();
  });

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      if (msg.type() === 'warning') {
        responseMessage.warnings.push(msg.text());
      }
  });

  await page.goto(`${url}${path}`);

  return responseMessage;
}

const formatStatus = (status: number): string => {
  if (status >= 200 && status < 400) {
    return chalk.green(status.toString());
  }
  if (status >= 400 && status < 500) {
    return chalk.yellow(status.toString());
  }
  return chalk.red(status.toString());
}

const formatErrorLength = (errors: string[]): string => {
  const color = errors.length ? 'red' : 'green';
  return `${chalk[color](errors.length.toString())}`;
};

const formatWarningLength = (warnings: string[]): string => {
  const color = warnings.length ? 'yellow' : 'green';
  return `${chalk[color](warnings.length.toString())}`;
};

const chalkReporter = (results: object[]) => {
  const log = console.log;
  log('\b');
  results.forEach((result: ResponseMessage) => {
    log(chalk.blue(result.path));
    log(`${chalk.gray('- Status:')} ${formatStatus(result.status)}`);
    log(`${chalk.gray('- Errors:')} ${formatErrorLength(result.exceptions)}`);
    if (result.warnings.length) {
      result.exceptions.forEach(e => log(`${chalk.gray('--')} ${chalk.red(e)}`));
    }
    log(`${chalk.gray('- Warnings:')} ${formatWarningLength(result.warnings)}`);
    if (result.warnings.length) {
      result.warnings.forEach(w => log(`${chalk.gray('--')} ${chalk.yellow(w)}`));
    }
  });
}

const jsonReporter = (result: object[]) => {
  const log = console.log;
  log(JSON.stringify(result));
}

export const run = async (config: Config, reporter: string) => {
  const protocol: string = config.protocol || 'http';
  const host: string = config.host || '127.0.0.1';
  const port: string = config.port || '3000';

  const paths: string[] = config.paths;
  const url = createUrl(protocol, host, port);

  console.clear();
  ora(`Running ${chalk.blue(url)}`).start();

  const browser = await puppeteer.launch();
  const runCheck = checkForErrors(browser, url);

  const results: ResponseMessage[] = await Promise.all(paths.map(path => runCheck(path)));
  const errors: ResponseMessage[] = results.filter(m => m.exceptions.length);

  await browser.close();

  switch (reporter) {
    case 'json-stdout':
      jsonReporter(results);
      break;
    case 'json':
      return JSON.stringify(results);
    default:
      chalkReporter(results);
  }

  if (errors.length) {
    process.exit(1);
    console.log(errors);
  } else {
    process.exit(0);
  }
};
