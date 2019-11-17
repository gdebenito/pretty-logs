import getProcessLine from './process-line';

const main = async () => {
  const configPath = process.argv[2];
  console.log(configPath);

  // const processLine = getProcessLine(configPath);
  // const processLine = await getProcessLine('../examples/simple.json');
  const processLine = await getProcessLine('../examples/express.json');

  process.stdin.resume();
  process.stdin.setEncoding('utf-8');

  // TODO better :)
  process.stdin.on('data', (chunk: string) => chunk.split('\n').map((log) => processLine.emit('line', log)));

  process.stdin.on('end', () => {
    process.stdout.write('done');
  });
};

main();
