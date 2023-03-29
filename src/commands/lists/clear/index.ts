import chalk from "chalk";
import meow from "meow";

import { CommandExecutor } from "../../../helpers/command-helper";
import { COMMAND_NAME } from "../../../helpers/constants";
import { getTasksV1Client } from "../../../helpers/google-helper";
import { determineTargetList } from "../../../helpers/tasks-helper";

const executeCommand: CommandExecutor = async () => {
  const cli = meow(
    `
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} lists clear [options] '<list id>'

    ${chalk.underline("Global Options")}
      --help, -h    Show help text

    ${chalk.underline("Examples")}
      Clears all completed tasks from list with id ABcd
      $ ${COMMAND_NAME} lists clear ABcd
  `,
    {
      autoHelp: true,
      description: "Clears all completed tasks from a list",
      flags: {
        help: {
          type: "boolean",
          alias: "h",
        },
      },
    }
  );

  const listIndicator = cli.input[2];

  if (!listIndicator) {
    console.log(
      chalk.red("Must specify a list to clear. See `lists clear --help`.")
    );
    return;
  }

  await clearList(listIndicator);

  console.log();
};

const clearList = async (listIndicator: string) => {
  const TasksV1 = getTasksV1Client();
  const {
    data: { items: lists },
  } = await TasksV1.tasklists.list();
  const list = determineTargetList(listIndicator, lists);

  console.log(chalk.grey(`Clearing tasks from list: ${list.title}`));
  await TasksV1.tasks.clear({ tasklist: list.id });
};

export default executeCommand;
