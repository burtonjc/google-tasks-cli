import chalk from 'chalk';
import meow from 'meow';

import {
  CommandExecutor,
  executeSubCommand,
} from '../../helpers/command-helper';
import { COMMAND_NAME } from '../../helpers/constants';

const executeCommand: CommandExecutor = () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} auth <command> [options]

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Commands')}
      login         Authorize access your Google Tasks
      revoke        Revoke access to a Google account

    ${chalk.underline('Examples')}
      To authorize tasks to access a Google account
      $ ${COMMAND_NAME} auth login

      To revoke access to a Google account
      $ ${COMMAND_NAME} auth revoke 'example@gmail.com'
  `, {autoHelp
    : false,
    description: 'Manage Google account authorizations',
  });

  return executeSubCommand(cli, __dirname);
}

export default executeCommand;
