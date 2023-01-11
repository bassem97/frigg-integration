const { createHandler } = require('../createHandler');

const serverlessHttp = require('serverless-http');
const { createApp } = require('../../../app');
const userMiddleware = require('../../routers/user');

const userApp = createApp((app) => {
    app.use(userMiddleware);
});

module.exports.handler = createHandler({
    eventName: 'HTTP Event: User',
    method: serverlessHttp(userApp),
});
