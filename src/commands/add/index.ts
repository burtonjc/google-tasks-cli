import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../helpers/command-helper';
import { getTasksV1Client } from '../../helpers/google-helper';

interface AddTaskFlags {
  list: string;
}

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks add [options] '<task name>'

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l  [required] Which list to add the task to

    ${chalk.underline('Examples')}
      Add a task called 'Build a chicken coop' to the 'House Projects' list
      $ tasks add --list 'House Projects' 'Build a chicken coop'
  `, {
    autoHelp: true,
    description: 'Add a Google Task',
    flags: {
      help: {
        type: 'boolean',
        alias: 'h',
      },
      list: {
        type: 'string',
        alias: 'l'
      },
    },
  });

  console.log(cli.input);
  const listName = cli.flags.list;
  const title = cli.input[1];

  if (!listName) {
    console.log(chalk.red('Must specify a list to add the task to. See `tasks add --help`.'));
    return;
  }
  if (!title) {
    console.log(chalk.red('Must specify a title for the task. See `tasks add --help`.'));
    return;
  }

  await addTask(title, listName);
}

const addTask = async (title: string, listName: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: lists } = await TasksV1.tasklists.list();
  const list = lists.items.find(l =>
    l.title.toLowerCase() === listName.toLowerCase()
  );

  const task = await TasksV1.tasks.insert({
    tasklist: list.id,
    requestBody: { title, }
  });

  console.log(task);
}

export default executeCommand;
