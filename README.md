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

## Creating custom Google OAuth client credentials (optional)
If you wish to set up your own credentials, follow these steps:

1. Go to [Console Cloud](https://console.cloud.google.com/).
2. Navigate to `APIs & Services` > `Enabled APIs & services` and enable the Google Tasks API.
3. Configure your `OAuth consent screen` adding scopes related to Google Tasks API.
4. Select `Create Credentials` under `Credentials`.
5. Create a new `OAuth client ID`.
6. Set the application type to `Desktop`.
7. Download the JSON file and replace the `.client.config.json` in the root folder with it.
8. Add `http:/localhost:8085/oauth2callback` as an item under the `redirect_uris` key in the downloaded JSON file.