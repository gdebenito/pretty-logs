import * as dateFormat from 'dateformat';
import colorMessage from './color-message';
import { Config } from './types/config';

const transform = (content: any, cfg: any): string => {
  let value = content;
  switch (cfg.transform.type) {
    case 'date':
      return dateFormat(value, cfg.transform.format);
    case 'string':
      return value;
    default:
      return '';
  }
};

const applyDefault = (cfg: any) => {
  switch (cfg.default) {
    case 'Date.now':
      return Date.now();
    default:
      return cfg.default;
  }
}

const getNestedObject = (obj: any, path: string) => {

  let value = obj;
  if (path !== '') {

    const splitedPath = path.split('.');
    const nextStepPath = splitedPath[0]
    const nestedObj = obj[nextStepPath];
    if (nestedObj !== undefined) {
      value = getNestedObject(nestedObj, splitedPath.filter((_, idx) => idx > 0).join('.'));
    } else {
      return ''
    }

  }

  return value;
}


const isNestedObject = (propertyKey: string): boolean => {
  return propertyKey.includes('.');
}

const transformJson = (log: { [key: string]: string }, conf: Config) => {

  let msg = conf.format;
  const cfg = conf.properties;

  Object.entries(cfg)
    .filter(([propertyName, confAttr]) => {
      // filter configuration properties which aren't used
      return msg.includes(propertyName);
    })
    .filter(([propertyName, confAttr]) => {
      // filter properties which content is undefined
      let propertyInfo: any = log[propertyName];
      return propertyInfo === undefined && confAttr.always || propertyInfo !== undefined || isNestedObject(propertyName);
    }).map(([propertyName, configurationAttributes]: any[]) => {
      let propertyInfo: any = log[propertyName];

      if (isNestedObject(propertyName)) {
        propertyInfo = getNestedObject(log, propertyName)
      }

      if (propertyInfo === undefined && configurationAttributes.always) {
        propertyInfo = applyDefault(configurationAttributes);
      }


      if (configurationAttributes.transform) {
        propertyInfo = transform(propertyInfo, configurationAttributes);
        if (configurationAttributes.transform.color) {
          const { value, type } = configurationAttributes.transform.color
          propertyInfo = colorMessage(type, value, propertyInfo)
        }
      }

      return [propertyName, propertyInfo];

    }).forEach(([key, beautifulMsg]) => {
      msg = msg.replace(key, beautifulMsg);
    })
  return msg;
};

export default transformJson;
