import express from 'express';

function setupStaticFileServing(app) {
    app.use(express.static('public'));
    app.use('/db', express.static('db'));
}

export default setupStaticFileServing;