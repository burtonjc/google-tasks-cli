import chalk from "chalk";
import { tasks_v1 } from "googleapis";
import Table from "cli-table";
import * as moment from "moment";

/**
 * Determine which Task List is indicated by `param`. Match first on exact id or
 * title. then soft match of id ends with and title contains.
 * @param indicator Indicator of which list to use
 * @param lists Array of all available Task Lists
 * @returns The matched task list
 */
export const determineTargetList = (
  indicator: string,
  lists: tasks_v1.Schema$TaskList[]
): tasks_v1.Schema$TaskList => {
  let list = lists.find((l) => l.id === indicator);
  if (list) {
    return list;
  }

  list = lists.find((l) => l.title === indicator);
  if (list) {
    return list;
  }

  const listMatches = lists.filter(
    (l) =>
      (indicator.length >= 4 && l.id.endsWith(indicator)) ||
      l.title.toLowerCase().includes(indicator.toLowerCase())
  );

  if (listMatches.length > 1) {
    console.log();
    console.error(
      chalk.redBright(
        `Too many lists matched by: ${indicator}. Please be more specific.`
      )
    );
    process.exit(1);
  } else if (listMatches.length === 0) {
    console.log();
    console.error(
      chalk.redBright(`Couldn't find a list matching: ${indicator}.`)
    );
    process.exit(1);
  }

  return listMatches[0];
};

const renderId = (id: string) =>
  chalk.dim.blueBright.italic(`[${id.substring(id.length - 4)}]`);

export const printTaskListItems = (
  list: tasks_v1.Schema$TaskList,
  tasks: tasks_v1.Schema$Task[]
) => {
  console.log();
  console.log(renderId(list.id), chalk.cyanBright.underline(list.title));

  if (!tasks || tasks.length === 0) {
    console.log(chalk.grey("All finished here!"));
    return;
  }

  const table = new Table({
    colWidths: [6, 2, 50, 12],
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    },
    style: { "padding-left": 0, "padding-right": 0 },
  });

  for (const task of tasks) {
    table.push([
      renderId(task.id),
      task.status === "completed" ? chalk.green("✓") : chalk.magenta("▢"),
      task.title,
      moment.utc(task.updated).fromNow(),
    ]);
  }

  console.log(table.toString());
};
