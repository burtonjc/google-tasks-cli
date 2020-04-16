import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { COMMAND_NAME } from '../../../helpers/constants';
import { getTasksV1Client } from '../../../helpers/google-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} lists delete [options] '<list id>'

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Examples')}
      Delete a list with id ABcd
      $ ${COMMAND_NAME} lists delete ABcd
  `, {
    autoHelp: true,
    description: 'Delete a Google Task list',
    flags: {
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  });

  const id = cli.input[2];

  if (!id) {
    console.log(chalk.red(`Must specify a id for the list. See \`${COMMAND_NAME} lists delete --help\`.`));
    return;
  }

  await deleteList(id);

  console.log();
}

const deleteList = async (idFragment: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: { items: lists } } = await TasksV1.tasklists.list();
  const list = lists.find(l => l.id.endsWith(idFragment));

  if (!list) {
    console.log(chalk.grey('Could not find a list with id', idFragment));
    return;
  }

  await TasksV1.tasklists.delete({ tasklist: list.id });
}

export default executeCommand;
