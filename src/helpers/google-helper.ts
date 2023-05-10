import chalk from 'chalk';
import fs from 'fs';
import { google } from 'googleapis';
import http from 'http';
import path from 'path';
import destroyer from 'server-destroy';
import url from 'url';
import { OAuth2Client } from 'googleapis-common';
import Configstore from 'configstore';

const opn = require('opn');
const pkg = require('../../package.json');

const AUTH_CALLBACK_PORT = 8085;
const SCOPES = [ 'https://www.googleapis.com/auth/tasks' ];

const keyPath = path.join(__dirname, '../..', '.client.config.json');
let keys: { client_id?: string, client_secret?: string, redirect_uris: string[] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).installed;
} else {
  keys = { redirect_uris: [''] };
}

const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

google.options({ auth: oauth2Client });

const conf = new Configstore(pkg.name);

export const getTasksV1Client = () => {
  const tokensJSON = conf.get('tokens');

  if (!tokensJSON) {
    console.log(chalk.red('Must login to a Google account using `tasks auth login`.'));
    return;
  }

  oauth2Client.credentials = JSON.parse(tokensJSON);
  return google.tasks('v1');
}

export const authenticate = async () => {

  const redirect_uri = `http://localhost:${ AUTH_CALLBACK_PORT }/oauth2callback`;
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    redirect_uri,
    scope: SCOPES.join(' '),
  });

  return new Promise<OAuth2Client>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (!(req.url.indexOf('/oauth2callback') > -1)) { return; }

        res.end('Authentication successful! Please return to the console.');
        server.destroy();

        const qs = new url.URL(
          req.url,
          redirect_uri
        ).searchParams;
        const tokenResponse = await oauth2Client.getToken(qs.get('code'));
        console.log(tokenResponse.res.data);
        conf.set({ tokens: JSON.stringify(tokenResponse.tokens) });
        oauth2Client.credentials = tokenResponse.tokens;

        resolve(oauth2Client);
      } catch (e) {
        reject(e);
      }
    }).listen(AUTH_CALLBACK_PORT, () => {
        // output a message to the console with the authorize url
        console.log(`Please visit ${authorizeUrl} to authorize this application`);
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then((cp: any) => cp.unref());
      });
    destroyer(server);
  });
}
