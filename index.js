#!/usr/bin/env node
const http = require('http');
const httpProxy = require('http-proxy');
const auth = require('basic-auth');

const argv = require('yargs')
  .env('PROXY')
  .default('targetPort', 80)
  .default('listenPort', 80)
  .demandOption([
    'targetHost',
    'targetPort',
    'listenPort',
    'username',
    'password',
  ]).argv;

const unauthorized = res => {
  res.writeHead(401, null, { 'WWW-Authenticate': 'Basic' });
  res.end();
};

const proxy = new httpProxy.createProxyServer({
  target: {
    host: argv.targetHost,
    port: argv.targetPort,
  },
});

http
  .createServer((req, res) => {
    const creds = auth(req);

    if (!creds) {
      return unauthorized(res);
    }

    const { name, pass } = creds;

    if (name !== argv.username || pass !== argv.password) {
      return unauthorized(res);
    }

    proxy.web(req, res, null, error => {
      if (error) {
        res.writeHead(502);
        res.end();
      }
    });
  })
  .listen(argv.listenPort);
