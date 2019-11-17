import * as EventEmitter from 'events';
import transformJson from './transform-json';

const getProcessLine = async (configPath: string) => {
  const config = await import(configPath);
  console.log(config);

  const processLine = new EventEmitter();


  processLine.on('line', (line: string) => {
    try {
      const json = JSON.parse(line);
      const pretty = transformJson(json, config);
      process.stdout.write(`${pretty}\n`);
      // console.log(json);
    } catch (err) {
      // unprocessable json
      process.stdout.write(`${line}\n`);
      // only for debug
      // console.error(err)
    }
  });

  return processLine;
};

export default getProcessLine;
