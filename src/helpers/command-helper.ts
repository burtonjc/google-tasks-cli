import chalk from "chalk";
import { Result } from "meow";
import { resolve } from "path";
import { inspect } from "util";

export interface CommandExecutor {
  (): Promise<void>;
}

let level = 0;
export const executeSubCommand = async (
  cli: Result,
  dir: string,
  defaultCommand?: string
) => {
  const command = cli.input[level++] || defaultCommand;

  try {
    const commandPath = resolve(dir, command);
    debug(`${command}:`, "requiring task from", commandPath);
    const executor = require(commandPath).default as CommandExecutor;
    await executor();
  } catch (error) {
    if (
      typeof error === "object" &&
      "code" in error &&
      error.code === "MODULE_NOT_FOUND"
    ) {
      console.log(inspect(error));
      console.log(`
        \r  ${chalk.red(`Error: unknown command "${chalk.bold(command)}"`)}
        \r  ${chalk.grey(`Run 'tasks --help' for usage`)}.
      `);
    } else {
      console.error(chalk.red(inspect(error)));
    }
  }
};

export const debug = (...log: any[]) => {
  if (process.env.DEBUG) {
    console.log(chalk.blue("DEBUG: ", ...log));
  }
};
