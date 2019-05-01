import chalk from 'chalk';
import meow from 'meow';

import {
  CommandExecutor,
  executeSubCommand,
} from '../../helpers/command-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ gtask lists <command> [options] ...

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Commands')}
      add           Add a list
      delete        Delete a list
      list          Show all lists
  `, { autoHelp: false, });

  await executeSubCommand(cli, __dirname);
}

export default executeCommand;
