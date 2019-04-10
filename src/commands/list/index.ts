import chalk from 'chalk';
import Table from 'cli-table';
import meow from 'meow';
import * as moment from 'moment';

import { CommandExecutor } from '../../helpers/command-helper';
import { getTasksV1Client } from '../../helpers/google-helper';
import { tasks_v1 } from 'googleapis';

interface ListFlags {
  list?: string;
  showCompleted?: boolean;
}

const executeCommand: CommandExecutor = async () => {
  const cli = meow(`
    ${chalk.underline(`Usage`)}
      $ tasks list [options]

    ${chalk.underline('Global Options')}
      --help, -h    Show help text

    ${chalk.underline('Options')}
      --list, -l  Which list to show the task from
      --showCompleted, -c Show completed tasks

    ${chalk.underline('Examples')}
      List all tasks from all lists
      $ tasks list

      List all tasks from the 'House Projects' list
      $ tasks list --list 'House Projects'
  `, {
    description: 'Show all tasks',
    flags: {
      list: {
        type: 'string',
        alias: 'l',
      },
      showCompleted: {
        type: 'boolean',
        alias: 'c',
      }
    },
  });

  await listTasks(cli.flags);
}

const listTasks = async (flags: ListFlags) => {
  const TasksV1 = getTasksV1Client();
  const { data: lists } = await TasksV1.tasklists.list();

  if (flags.list) {
    const list = lists.items.find(l =>
      l.title.toLowerCase() === flags.list.toLowerCase()
    );
    printTaskListItems(flags, TasksV1, list);
  } else {
    for (const list of lists.items) {
      printTaskListItems(flags, TasksV1, list);
    }
  }

}

const printTaskListItems = async (flags: ListFlags, client: tasks_v1.Tasks, list: tasks_v1.Schema$TaskList) => {
  const { data: tasks } = await client.tasks.list({
    tasklist: list.id,
    showCompleted: flags.showCompleted,
    showHidden: flags.showCompleted,
  });

  if (!tasks.items) { return; }

  const table = new Table({
    colWidths: [3, 5, 50, 12],
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 0 }
  });

  for (const task of tasks.items) {
    table.push([
      task.status === 'completed' ? `[${chalk.green('x')}]` : '[ ]',
      chalk.grey(task.id.substr(-5)),
      task.title,
      moment.utc(task.updated).fromNow()
    ])
  }

  console.log();
  console.log(chalk.blue.underline(list.title));
  console.log(table.toString());
}

export default executeCommand;

