import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../helpers/command-helper';

const executeCommand: CommandExecutor = () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks auth login

    ${chalk.underline('Global Options')}
      --help, -h    Show help text
  `, {
    description: 'Authorize a Google account',
  });

  return Promise.resolve();
}

export default executeCommand;

