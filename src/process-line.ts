import * as EventEmitter from 'events';
import * as dateFormat from 'dateformat';
import * as chalk from 'chalk';
import * as config from '../simple.json';

console.log(config);

const processLine = new EventEmitter();

// processLine.on('line', (line: string) => {
//   process.stdout.write(line + '\n');
// });

// const getConfig = async (path = '../logs.json', configurationName = 'default') => {
//   const config = await import(path);
//   return config[configurationName];
//   // console.log(config);
// };

// const regexFn = (value: any, regexConfig: any) => {
//   const regexKeys = Object.keys(regexConfig);
//   const firstMatch = regexKeys.filter((regexKey) => {
//     const regex = new RegExp(regexKey);
//     return regex.test(value);
//   }).map((regexKey: any) => {
//     console.log(regexKey);
//     return regexKey;
//   }).filter((_: any, idx: number) => idx === 0) as unknown;
//   const badCode = firstMatch as string;
//   return regexConfig[badCode];
// };

// TODO:type config
// const transform = (config: any) => {
//   const { keys } = config;
//
//   console.log(keys)
//
//   const valuesToTransform = Object.keys(keys);
//
//   return (logObject: any) => {
//     const logKeys = Object.keys(logObject);
//     const keysToPrint = logKeys.filter((logKey) => valuesToTransform.includes(logKey));
//
//     return keysToPrint.map((key: string) => {
//       const value = logObject[key];
//       const logConfig = config[key];
//       if (logConfig.regex) {
//         const printConfig = regexFn(value, logConfig.regex);
//         console.log(printConfig);
//       }
//       return key;
//     });
//   };
// };

const formatEpochToFormat = (epoch: number, format: string):string => dateFormat(epoch, format);

const colorMessage = (type:string, value: string, message:string) => {
  let msg;
  switch (type) {
    case 'keyword':
      msg = chalk.keyword(value)(message);
      break;
    // case 'hex':
    //   msg = chalk.hex(value)(message);
    // break;
    // case 'rgb':
    //   msg = chalk.rgb(...value)(message);
    // break;
    default:
      msg = message;
      break;
  }
  return msg;
};

const transformJsonToBeautifulString = (input: any, conf: any) => {
  const keys = Object.keys(conf);
  const formatted = keys.filter((k) => !!input[k]).map((k) => {
    const cfg = conf[k];
    let log = '';
    switch (cfg.input.format) {
      case 'epoch':
        log = formatEpochToFormat(input[k], cfg.output.format);
        break;
      default:
        log = '';
        break;
    }
    const { type, value } = cfg.output.color;
    log = colorMessage(type, value, log);
    return log;
  }).join('');
  return formatted;
};

processLine.on('line', (line: string) => {
  try {
    const json = JSON.parse(line);
    const pretty = transformJsonToBeautifulString(json, config);
    process.stdout.write(`${pretty}\n`);
    // console.log(json);
  } catch (err) {
    // unprocessable json
    process.stdout.write(`${line}\n`);
  }
});

export default processLine;
