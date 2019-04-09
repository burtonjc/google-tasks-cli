import chalk from 'chalk';
import meow from 'meow';

import {
  CommandExecutor,
  executeSubCommand,
} from '../../helpers/command-helper';

const executeCommand: CommandExecutor = () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks auth <command> [options]

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Commands')}
      list          List authorized Google accounts
      login         Authorize access your Google Tasks
      revoke        Revoke access to a Google account

    ${chalk.underline('Examples')}
      To list authorized Google accounts
      $ tasks auth list

      To authorize tasks to access a Google account
      $ tasks auth login

      To revoke access to a Google account
      $ tasks auth revoke 'example@gmail.com'
  `, {
    autoHelp: false,
    description: 'Manage Google account authorizations',
  });

  return executeSubCommand(cli, __dirname);
}

export default executeCommand;
