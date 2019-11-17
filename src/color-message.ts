import * as chalk from 'chalk';

export default (type:string, value: string, message:string) => {
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
