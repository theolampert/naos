#!/usr/bin/env node
import program from 'commander';
import path from 'path';

import { run } from './index';
import { Config } from './types/types'

const pwd = process.env.PWD;
const pkg = require('../package.json');

let configPath: string = path.join(pwd, './naos-config.json');
let reporterFormat = 'pretty';

const config = (val: string) => {
  configPath = path.join(pwd, val);
}

const format = (val: string) => {
  reporterFormat = val;
}

program
  .name(pkg.name)
  .version(pkg.version)
  .option('-c, --config <file>', 'Specify a naos-config.json file.', config)
  .option('-f, --format <format>', 'Specify a format [ pretty (default), json ].', format)
  .parse(process.argv);

  const configFile = require(configPath);
  run(configFile, reporterFormat);
