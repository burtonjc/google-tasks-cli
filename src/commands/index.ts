import chalk from 'chalk';
import meow from 'meow';

import {
  CommandExecutor,
  executeSubCommand,
} from '../helpers/command-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks <command> [options] ...

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Commands')}
      add           Add a task
      auth          Manage authenticated Google accounts
      complete      Complete a task
      delete        Delete a task
  `, { autoHelp: false, });

  await executeSubCommand(cli, __dirname);
}

export default executeCommand;
