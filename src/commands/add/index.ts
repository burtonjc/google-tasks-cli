import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../helpers/command-helper';

const executeCommand: CommandExecutor = () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks add [options] '<task name>'

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l  Which list to add the task to

    ${chalk.underline('Examples')}
      Add a task called 'Build a chicken coop' to the 'House Projects' list
      $ tasks add --list 'House Projects' 'Build a chicken coop'
  `, {
    description: 'Add a Google Task',
    flags: {
      list: {
        type: 'string',
        alias: 'l'
      }
    },
  });

  console.log(cli.input, cli.flags);

  const name = cli.input[1];
  const list = cli.flags['list'];

  console.log('name:', name);
  console.log('list:', list);

  return Promise.resolve();
}

export default executeCommand;

