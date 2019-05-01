# Google Tasks CLI
A minimal CLI wrapper for Google Tasks.

## Usage
```
> gtasks --help

  A CLI wrapper for Google Tasks

  Usage
    $ gtask <command> [options] ...

  Global Options
    --help, -h    Show help text

  Commands
    auth          Manage authenticated Google accounts
    lists         Manage task lists
    tasks         Manage tasks
```

You must first login to a Google account using the `gtasks auth login` command and completing the OAuth flow. Other commands will not work until you are authenticated.

## Installation
Due to no good way to store Google OAuth client credentials in a cli package, I have decided to not publish this to NPM for now. That means to install this, you need to clone it and npm link it:
1. `git clone git@github.com:burtonjc/google-tasks-cli.git && cd google-tasks-cli` - clone the repo and `cd` into it
2. `npm install` - install the dependencies
3. `npm run build` - build the package
4. `npm link` - create a global `gtasks` command
