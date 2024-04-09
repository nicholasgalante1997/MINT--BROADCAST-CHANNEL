import Logger from '../lib/Logger.js';

function echoPath(req, res, next) {
  if (req.path.startsWith('/db')) {
    Logger.info('Requested db route: ' + req.path);
  } else {
    Logger.info('Requested file from path: public' + req.path);
  }
  next();
}

export default echoPath;
