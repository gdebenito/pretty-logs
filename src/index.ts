import processLine from './process-line';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (chunk: string) => chunk.split('\n').map((log) => processLine.emit('line', log)));

process.stdin.on('end', () => {
  process.stdout.write('done');
});
