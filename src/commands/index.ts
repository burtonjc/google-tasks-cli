import chalk from "chalk";
import meow from "meow";

import { CommandExecutor, executeSubCommand } from "../helpers/command-helper";
import { COMMAND_NAME } from "../helpers/constants";

const executeCommand: CommandExecutor = async () => {
  const cli = meow(
    `
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} <command> [options] ...

    ${chalk.underline("Global Options")}
      --help, -h    Show help text

    ${chalk.underline("Commands")}
      auth          Manage authenticated Google account
      lists         Manage Google Task lists
      tasks         Manage Google Task tasks
  `,
    { autoHelp: false }
  );

  await executeSubCommand(cli, __dirname, "tasks");
};

export default executeCommand;
