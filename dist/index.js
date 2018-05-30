"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const createUrl = (protocol, host, port) => `${protocol}://${host}:${port}`;
const checkForErrors = (browser, url) => (path) => __awaiter(this, void 0, void 0, function* () {
    const page = yield browser.newPage();
    const responseMessage = {
        path,
        warnings: [],
        status: null,
        exceptions: [],
    };
    page.on('pageerror', (error) => {
        responseMessage.exceptions.push(error.toString());
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
    yield page.goto(`${url}${path}`);
    return responseMessage;
});
const formatStatus = (status) => {
    if (status >= 200 && status < 400) {
        return chalk_1.default.green(status.toString());
    }
    if (status >= 400 && status < 500) {
        return chalk_1.default.yellow(status.toString());
    }
    return chalk_1.default.red(status.toString());
};
const formatErrorLength = (errors) => {
    const color = errors.length ? 'red' : 'green';
    return `${chalk_1.default[color](errors.length.toString())}`;
};
const formatWarningLength = (warnings) => {
    const color = warnings.length ? 'yellow' : 'green';
    return `${chalk_1.default[color](warnings.length.toString())}`;
};
const chalkReporter = (results) => {
    const log = console.log;
    log('\b');
    results.forEach((result) => {
        log(chalk_1.default.blue(result.path));
        log(`${chalk_1.default.gray('- Status:')} ${formatStatus(result.status)}`);
        log(`${chalk_1.default.gray('- Errors:')} ${formatErrorLength(result.exceptions)}`);
        if (result.warnings.length) {
            result.exceptions.forEach(e => log(`${chalk_1.default.gray('--')} ${chalk_1.default.red(e)}`));
        }
        log(`${chalk_1.default.gray('- Warnings:')} ${formatWarningLength(result.warnings)}`);
        if (result.warnings.length) {
            result.warnings.forEach(w => log(`${chalk_1.default.gray('--')} ${chalk_1.default.yellow(w)}`));
        }
    });
};
const jsonReporter = (result) => {
    const log = console.log;
    log(JSON.stringify(result));
};
exports.run = (config, reporter) => __awaiter(this, void 0, void 0, function* () {
    const protocol = config.protocol || 'http';
    const host = config.host || '127.0.0.1';
    const port = config.port || '3000';
    const paths = config.paths;
    const url = createUrl(protocol, host, port);
    console.clear();
    ora_1.default(`Running ${chalk_1.default.blue(url)}`).start();
    const browser = yield puppeteer_1.default.launch();
    const runCheck = checkForErrors(browser, url);
    const results = yield Promise.all(paths.map(path => runCheck(path)));
    const errors = results.filter(m => m.exceptions.length);
    yield browser.close();
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
    }
    else {
        process.exit(0);
    }
});
//# sourceMappingURL=index.js.map