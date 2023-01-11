const { createHandler } = require('./createHandler');

const ExampleQueuer = require('../workers/examples/ExampleQueuer');

module.exports.handler = createHandler({
    eventName: 'Example Queuer',
    isUserFacingResponse: false,
    method: async (event) => {
        const worker = new ExampleQueuer();
        await worker._run();
        return {
            message: 'Successfully Started the Example Queuer',
            input: event,
        };
    },
});
