import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { EnvironmentType } from "../dto/constants";

// var YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = EnvironmentType.PRODUCTION;
  }
  // if (process.env.NODE_ENV !== EnvironmentType.PRODUCTION) {
  // }

  // let configFilePath = join(__dirname, YAML_CONFIG_FILENAME);
  let configFilePath = `config.${process.env.NODE_ENV}.yaml`;

  console.log(`加载配置文件：${configFilePath}`);
  return yaml.load(readFileSync(configFilePath, "utf8")) as Record<string, any>;
};


export const isDev = process.env.NODE_ENV !== EnvironmentType.PRODUCTION;
