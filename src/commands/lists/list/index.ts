import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { getTasksV1Client } from '../../../helpers/google-helper';

interface AddTaskFlags {
  list: string;
}

const executeCommand: CommandExecutor = async () => {
  meow(`
    ${chalk.underline(`Usage`)}
      $ gtask lists list [options]

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Examples')}
      Show all task lists
      $ gtask lists list 'House Projects'
  `, {
    autoHelp: true,
    description: 'Show Google Task lists',
    flags: {
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  });

  await listTaskLists();
}

const listTaskLists = async () => {
  const TasksV1 = getTasksV1Client();
  const { data: { items: lists } } = await TasksV1.tasklists.list();

  console.log();
  for (const list of lists) {
    console.log(
      chalk.grey(list.id.substr(-4)),
      // chalk.blue.underline(list.title),
      list.title,
    );
  }
  console.log();
}

export default executeCommand;
