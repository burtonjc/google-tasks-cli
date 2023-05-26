import chalk from "chalk";
import meow from "meow";

import {
  CommandExecutor,
  executeSubCommand,
} from "../../helpers/command-helper";
import { COMMAND_NAME } from "../../helpers/constants";

const executeCommand: CommandExecutor = async () => {
  const cli = meow(
    `
    ${chalk.underline(`Usage`)}
      $ ${COMMAND_NAME} lists <command> [options] ...

    ${chalk.underline("Global Options")}
      --help, -h    Show help text

    ${chalk.underline("Commands")}
      add           Add a list
      delete        Delete a list
      list          Show all lists
  `,
    { autoHelp: true }
  );

  await executeSubCommand(cli, __dirname, "list");
};

export default executeCommand;
