export interface ResponseMessage {
  path: string;
  exceptions: string[];
  warnings: string[];
  status: number;
}

export interface Config {
  protocol: string;
  host: string;
  port: string;
  paths: string[];
}
