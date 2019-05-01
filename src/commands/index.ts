import chalk from 'chalk';
import meow from 'meow';

import {
  CommandExecutor,
  executeSubCommand,
} from '../helpers/command-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ gtask <command> [options] ...

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Commands')}
      auth          Manage authenticated Google accounts
      lists         Manage task lists
      tasks         Manage tasks
  `, { autoHelp: false, });

  if ( cli.input.length === 0 ) {
    console.log(cli.help);
    return;
  }

  await executeSubCommand(cli, __dirname);
}

export default executeCommand;
