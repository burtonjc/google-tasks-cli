import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { getTasksV1Client } from '../../../helpers/google-helper';
import { printTaskListItems } from '../../../helpers/tasks-helper';

interface AddTaskFlags {
  list: string;
}

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ gtask tasks add [options] '<task name>'

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l  [required] Which list to add the task to

    ${chalk.underline('Examples')}
      Add a task called 'Build a chicken coop' to the 'House Projects' list
      $ gtask tasks add --list 'House Projects' 'Build a chicken coop'
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

  const listName = cli.flags.list;
  const title = cli.input[2];

  if (!listName) {
    console.log(chalk.red('Must specify a list to add the task to. See `tasks add --help`.'));
    return;
  }
  if (!title) {
    console.log(chalk.red('Must specify a title for the task. See `tasks add --help`.'));
    return;
  }

  const { list, tasks } = await addTask(title, listName);

  printTaskListItems(list, tasks);
  console.log();
}

const addTask = async (title: string, listName: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: lists } = await TasksV1.tasklists.list();
  const list = lists.items.find(l =>
    l.title.toLowerCase() === listName.toLowerCase()
  );

  await TasksV1.tasks.insert({
    tasklist: list.id,
    requestBody: { title, }
  });

  const { data: { items: tasks }} = await TasksV1.tasks.list({ tasklist: list.id });

  return { list, tasks };
}

export default executeCommand;
