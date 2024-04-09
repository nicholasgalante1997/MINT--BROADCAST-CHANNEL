import http from 'http';
import express from 'express';

import echoPath from './middleware/echo-path.js';
import setupStaticFileServing from './middleware/express-static.js';

import Logger from './lib/Logger.js';

function run() {
  const port = process.env.PORT || 8082;
  const server = setupServer();
  server.listen(port, function () {
    Logger.info('blackthorn-static-server started on port ' + port);
  });
}

function setupServer() {
  const app = express();
  app.use(echoPath);
  setupStaticFileServing(app);
  return http.createServer(app);
}

run();
