#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
const pwd = process.env.PWD;
const pkg = require('../package.json');
let configPath = path_1.default.join(pwd, './naos-config.json');
let reporterFormat = 'pretty';
const config = (val) => {
    configPath = path_1.default.join(pwd, val);
};
const format = (val) => {
    reporterFormat = val;
};
commander_1.default
    .name(pkg.name)
    .version(pkg.version)
    .option('-c, --config <file>', 'Specify a naos-config.json file.', config)
    .option('-f, --format <format>', 'Specify a format [ pretty (default), json ].', format)
    .parse(process.argv);
const configFile = require(configPath);
index_1.run(configFile, reporterFormat);
//# sourceMappingURL=cli.js.map