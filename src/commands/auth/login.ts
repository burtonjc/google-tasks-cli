import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../helpers/command-helper';
import { authenticate } from '../../helpers/google-helper';

const executeCommand: CommandExecutor = async () => {
  meow(`
    ${chalk.underline(`Usage`)}
      $ tasks auth login

    ${chalk.underline('Global Options')}
      --help, -h    Show help text
  `, {
    description: 'Authorize a Google account',
    flags: {
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  });

  await authenticate();
}

export default executeCommand;

