import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../helpers/command-helper';
import { getTasksV1Client } from '../../helpers/google-helper';
import { printTaskListItems } from '../../helpers/tasks-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks uncheck [options] <task id>

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l    [required] Which list the referenced task is in

    ${chalk.underline('Examples')}
      Mark the task with id 'abc123' from the 'Home Projects' list incomplete
      $ tasks uncheck --list 'Home Projects' abc123
  `, {
    autoHelp: true,
    description: 'Mark a Google Task incomplete',
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
  const id = cli.input[1];

  if (!listName) {
    console.log(chalk.red('Must specify which list the specified task is in. See `tasks uncheck --help`.'));
    return;
  }
  if (!id) {
    console.log(chalk.red('Must specify a id for the task. See `tasks uncheck --help`.'));
    return;
  }

  const { list, tasks, } = await uncheckTask(listName, id);

  printTaskListItems(list, tasks);
  console.log();
}

const uncheckTask = async (listName: string, id: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: lists } = await TasksV1.tasklists.list();
  const list = lists.items.find(l =>
    l.title.toLowerCase() === listName.toLowerCase()
  );
  const {data: { items: tasks }} = await TasksV1.tasks.list({
    showCompleted: true,
    showHidden: true,
    tasklist: list.id,
  });

  const taskIndex = tasks.findIndex(t => t.id.endsWith(id));
  const { data: task } = await TasksV1.tasks.patch({
    requestBody: {
      completed: null,
      hidden: false,
      status: 'needsAction',
    },
    task: tasks[taskIndex].id,
    tasklist: list.id,
  });
  tasks.splice(taskIndex, 1, task);

  return { list, tasks };
}

export default executeCommand;
