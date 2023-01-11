const { createHandler } = require('./createHandler');

const ExamplePollWorker = require('../workers/examples/ExamplePollWorker');

module.exports.crossbeamPollWorker = createHandler({
    eventName: 'Example Poll Worker',
    isUserFacingResponse: false,
    method: async (event) => {
        const worker = new ExamplePollWorker();
        await worker.run(event);
        return {
            message: 'Successfully processed the Example Poll Worker',
            input: event,
        };
    },
});
