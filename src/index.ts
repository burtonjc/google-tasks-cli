#!/usr/bin/env node
import 'source-map-support/register';

import chalk from 'chalk';
import { inspect } from 'util';

import executeCommand from './commands';

const main = async() => {
  try {
    await executeCommand();
  } catch (error) {
    console.error(chalk.red(inspect(error)));
    process.exit(1);
  }
}

main();
