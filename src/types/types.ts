export interface ResponseMessage {
  path: string;
  exceptions: string[];
  consoleWarnings: string[];
  consoleErrors: object[];
  status: number;
}

export interface Config {
  protocol: string;
  host: string;
  port: string;
  paths: string[];
}
