import express from 'express';

function setupStaticFileServing(app) {
  app.use(express.static('public'));
  app.use('/db', express.static('db'));
  app.use('/svgs', express.static('svgs'));
}

export default setupStaticFileServing;
