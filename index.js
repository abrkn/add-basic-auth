#!/usr/bin/env node
const http = require('http');
const httpProxy = require('http-proxy');
const auth = require('basic-auth');

const argv = require('yargs')
  .env('PROXY')
  .default('targetPort', 80)
  .default('listenPort', 80)
  .example(
    'add-basic-auth --listenPort 3001 --username foo --password bar --target http://brekken.com'
  )
  .demandOption(['target', 'listenPort', 'username', 'password']).argv;

const unauthorized = res => {
  res.writeHead(401, null, { 'WWW-Authenticate': 'Basic' });
  res.end();
};

const proxy = new httpProxy.createProxyServer({
  target: argv.target,
});

http
  .createServer((req, res) => {
    const creds = auth(req);

    if (!creds) {
      return unauthorized(res);
    }

    const { name, pass } = creds;

    if (name !== argv.username || pass !== argv.password) {
      console.warn(
        `Incorrect username and password from ${req.socket.remoteAddress}`
      );
      return unauthorized(res);
    }

    proxy.web(req, res, null, error => {
      if (error) {
        console.warn(`Upstream error: ${error.message}`);
        res.writeHead(502);
        res.end();
      }
    });
  })
  .listen(argv.listenPort, () => {
    console.log(
      `Proxying with basic auth from port ${argv.listenPort} to ${argv.target}`
    );
  });
