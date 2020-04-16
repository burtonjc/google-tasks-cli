import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { COMMAND_NAME } from '../../../helpers/constants';
import { getTasksV1Client } from '../../../helpers/google-helper';
import { printTaskListItems } from '../../../helpers/tasks-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} tasks delete [options] <task id>

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l    [required] Which list the referenced task is in

    ${chalk.underline('Examples')}
      Hide the task with id 'abc123' from the 'Home Projects' list
      $ ${COMMAND_NAME} tasks delete --list 'Home Projects' abc123
  `, {
    autoHelp: true,
    description: 'Delete a Google Task',
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
  const id = cli.input[2];

  if (!listName) {
    console.log(chalk.red('Must specify which list the specified task is in. See `tasks delete --help`.'));
    return;
  }
  if (!id) {
    console.log(chalk.red('Must specify a id for the task. See `tasks delete --help`.'));
    return;
  }

  const { list, tasks, } = await deleteTask(listName, id);

  printTaskListItems(list, tasks);
  console.log();
}

const deleteTask = async (listName: string, id: string) => {
  const TasksV1 = getTasksV1Client();
  const { data: lists } = await TasksV1.tasklists.list();
  const list = lists.items.find(l =>
    l.title.toLowerCase() === listName.toLowerCase()
  );
  const {data: { items: tasks }} = await TasksV1.tasks.list({
    tasklist: list.id,
    showCompleted: true,
    showHidden: true,
  });
  const taskIndex = tasks.findIndex(t => t.id.endsWith(id));

  const { data: task } = await TasksV1.tasks.patch({
    requestBody: {
      deleted: true,
    },
    task: tasks[taskIndex].id,
    tasklist: list.id,
  });
  tasks.splice(taskIndex, 1);

  return { list, tasks };
}

export default executeCommand;
