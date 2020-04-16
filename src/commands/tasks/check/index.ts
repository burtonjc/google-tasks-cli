import chalk from 'chalk';
import meow from 'meow';

import { CommandExecutor } from '../../../helpers/command-helper';
import { COMMAND_NAME } from '../../../helpers/constants';
import { getTasksV1Client } from '../../../helpers/google-helper';
import { printTaskListItems } from '../../../helpers/tasks-helper';

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} tasks check [options] <task id>

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l    [required] Which list the referenced task is in

    ${chalk.underline('Examples')}
      Mark the task with id 'abc123' from the 'Home Projects' list complete
      $ ${COMMAND_NAME} tasks check --list 'Home Projects' abc123
  `, {
    autoHelp: true,
    description: 'Mark a Google Task complete',
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
    console.log(chalk.red('Must specify which list the specified task is in. See `tasks check --help`.'));
    return;
  }
  if (!id) {
    console.log(chalk.red('Must specify a id for the task. See `tasks check --help`.'));
    return;
  }

  const { list, tasks } = await checkTask(listName, id);

  printTaskListItems(list, tasks);
  console.log();
}

const checkTask = async (listName: string, id: string) => {
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
      status: 'completed',
    },
    task: tasks[taskIndex].id,
    tasklist: list.id,
  });
  tasks.splice(taskIndex, 1, task);

  return { list, tasks };
}

export default executeCommand;
