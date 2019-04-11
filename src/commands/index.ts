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
      check         Mark a task as complete
      delete        Delete a task
      uncheck       Mark a task as not complete
  `, { autoHelp: false, });

  await executeSubCommand(cli, __dirname);
}

export default executeCommand;
