import * as EventEmitter from 'events';
import config from './../logs.json';

console.log(config)

const processLine = new EventEmitter();

// processLine.on('line', (line: string) => {
//   process.stdout.write(line + '\n');
// });

// const getConfig = async (path = '../logs.json', configurationName = 'default') => {
//   const config = await import(path);
//   return config[configurationName];
//   // console.log(config);
// };

const regexFn = (value: any, regexConfig: any) => {
  const regexKeys = Object.keys(regexConfig);
  const firstMatch = regexKeys.filter((regexKey) => {
    const regex = new RegExp(regexKey);
    return regex.test(value);
  }).map((regexKey: any) => {
    console.log(regexKey);
    return regexKey;
  }).filter((_: any, idx: number) => idx === 0) as unknown;
  const badCode = firstMatch as string;
  return regexConfig[badCode];
};

// TODO:type config
const transform = (config: any) => {
  const { keys } = config;

  console.log(keys)

  const valuesToTransform = Object.keys(keys);

  return (logObject: any) => {
    const logKeys = Object.keys(logObject);
    const keysToPrint = logKeys.filter((logKey) => valuesToTransform.includes(logKey));

    return keysToPrint.map((key: string) => {
      const value = logObject[key];
      const logConfig = config[key];
      if (logConfig.regex) {
        const printConfig = regexFn(value, logConfig.regex);
        console.log(printConfig);
      }
      return key;
    });
  };
};

let transformFn = transform( config['default'] )

// (async () => {
//   const conf = await getConfig();
//   transformFn = transform(conf);
// })();

processLine.on('line', (line: string) => {
  try {
    const json = JSON.parse(line);
    transformFn(json);
    // console.log(json);
  } catch (err) {
    // unprocessable json
    process.stdout.write(`${line}\n`);
  }
});

export default processLine;
