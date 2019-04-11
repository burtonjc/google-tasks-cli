import chalk from 'chalk';
import { tasks_v1 } from 'googleapis';
import Table from 'cli-table';
import * as moment from 'moment';

export const printTaskListItems = async (list: tasks_v1.Schema$TaskList, tasks: tasks_v1.Schema$Task[]) => {
  console.log();
  console.log(chalk.blue.underline(list.title));

  if (!tasks || tasks.length === 0) {
    console.log(chalk.grey('All finished here!'));
    return;
  }

  const table = new Table({
    colWidths: [4, 2, 50, 12],
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 0 }
  });

  for (const task of tasks) {
    table.push([
      chalk.grey(task.id.substr(-4)),
      task.status === 'completed' ? chalk.green('✓') : chalk.magenta('▢'),
      task.title,
      moment.utc(task.updated).fromNow(),
    ])
  }

  console.log(table.toString());
}
