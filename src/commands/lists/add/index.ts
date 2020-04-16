import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { COMMAND_NAME } from '../../../helpers/constants';
import { getTasksV1Client } from '../../../helpers/google-helper';
import { printTaskListItems } from '../../../helpers/tasks-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} lists add [options] '<list name>'

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Examples')}
      Add a list called 'House Projects'
      $ ${COMMAND_NAME} lists add 'House Projects'
  `, {
    autoHelp: true,
    description: 'Add a Google Task list',
    flags: {
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  });

  const title = cli.input[2];

  if (!title) {
    console.log(chalk.red(`Must specify a title for the list. See \`${COMMAND_NAME} lists add --help\`.`));
    return;
  }

  const { list } = await addList(title);

  printTaskListItems(list, []);
  console.log();
}

const addList = async (title: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: list } = await TasksV1.tasklists.insert({
    requestBody: { title },
  });

  return { list };
}

export default executeCommand;
