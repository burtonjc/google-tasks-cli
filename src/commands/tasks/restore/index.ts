import chalk from "chalk";
import meow from "meow";

import { CommandExecutor } from "../../../helpers/command-helper";
import { COMMAND_NAME } from "../../../helpers/constants";
import { getTasksV1Client } from "../../../helpers/google-helper";
import {
  determineTargetList,
  printTaskListItems,
} from "../../../helpers/tasks-helper";

const executeCommand: CommandExecutor = async () => {
  const cli = meow(
    `
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} tasks restore [options] <task id>

    ${chalk.underline("Global Options")}
      --help, -h    Show help text

    ${chalk.underline("Options")}
      --list, -l    [required] Which list the referenced task is in

    ${chalk.underline("Examples")}
      Restore the task with id 'abc123' in the 'Home Projects' list
      $ ${COMMAND_NAME} tasks restore --list 'Home Projects' abc123
  `,
    {
      autoHelp: true,
      description: "Restore a deleted Google Task",
      flags: {
        help: {
          type: "boolean",
          alias: "h",
        },
        list: {
          type: "string",
          alias: "l",
        },
      },
    }
  );

  const listIndicator = cli.flags.list;
  const id = cli.input[2];

  if (!listIndicator) {
    console.log(
      chalk.red(
        "Must specify which list the specified task is in. See `tasks restore --help`."
      )
    );
    return;
  }
  if (!id) {
    console.log(
      chalk.red("Must specify a id for the task. See `tasks restore --help`.")
    );
    return;
  }

  const { list, tasks } = await restoreTask(listIndicator, id);

  printTaskListItems(list, tasks);
  console.log();
};

const restoreTask = async (listIndicator: string, id: string) => {
  const TasksV1 = getTasksV1Client();
  const {
    data: { items: lists },
  } = await TasksV1.tasklists.list();
  const list = determineTargetList(listIndicator, lists);

  let {
    data: { items: tasks },
  } = await TasksV1.tasks.list({
    showCompleted: true,
    showDeleted: true,
    showHidden: true,
    tasklist: list.id,
  });

  const taskIndex = tasks.findIndex((t) => t.id.endsWith(id));

  const { data: task } = await TasksV1.tasks.patch({
    requestBody: {
      deleted: false,
    },
    task: tasks[taskIndex].id,
    tasklist: list.id,
  });
  tasks.splice(taskIndex, 1, task);
  tasks = tasks.filter((t) => !t.deleted);

  return { list, tasks };
};

export default executeCommand;
