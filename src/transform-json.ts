import * as dateFormat from 'dateformat';
import colorMessage from './color-message';

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
            return '';
    }
}

const transformJson = (log: {[key:string]:string}, conf: any) => {
  let msg = conf.format;
  const cfg = conf.properties;
  // Object.entries(inputLog).filter((v) => cfg[v[0]]).map(([key, v]) => {
  //   let log = transform(v, cfg[key]);
  //   const { type, value } = cfg[key].transform.color;
  //   log = colorMessage(type, value, log);
  //   return [key, log];
  // }).forEach(([key, log]) => {
  //   msg = msg.replace(key, log);
  // });

  Object.entries(cfg).filter(([propertyName,confAttr]:any[]) => {
      let propertyInfo: any = log[propertyName];
      return propertyInfo === undefined && confAttr.always || propertyInfo !== undefined;
  }).map(([propertyName,configurationAttributes]:any[]) => {
      let propertyInfo: any = log[propertyName];
      const formattedMsg= transform(propertyInfo,configurationAttributes);
      const {value, type} = configurationAttributes.transform.color
      const colorMsg = colorMessage(type,value,formattedMsg)
      // console.log(colorMsg)
      // console.log(propertyName)
      return [propertyName,colorMsg];

  }).forEach(([key,beautifulMsg]) => {
      msg = msg.replace(key,beautifulMsg);
  })
  return msg;
};

export default transformJson;
