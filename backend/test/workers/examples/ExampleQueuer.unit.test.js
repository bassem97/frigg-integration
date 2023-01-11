const ExampleQueuer = require('../../../src/workers/examples/ExampleQueuer');
const QueuerUtil = require('../../../src/utils/QueuerUtil');
const { Integration } = require('@friggframework/integrations');
const messagesReceived = [];

jest.mock('aws-sdk', () => {
    const SQSMocked = {
        sendMessage: jest.fn().mockImplementation((params) => {
            messagesReceived.push(params.MessageBody);
            Promise.resolve();
        }),
        promise: jest.fn()
    };

    const configMocked = {
        update: (params) => console.log(params)
    };

    return {
        config: configMocked,
        SQS: jest.fn(() => SQSMocked)
    };
});


describe('ExampleQueuer unit tests', () => {
    let exampleQueuer;

    it('Items are successfully enqueued', async () => {
        const mockedIntegration = { id: 775656, config: { useMasterBoards: true } };
        let sentBodies = [];

        jest
            .spyOn(Integration.prototype, 'list')
            .mockImplementation((params) => {
                return [mockedIntegration];
            });

        jest
            .spyOn(QueuerUtil.prototype, 'enqueue')
            .mockImplementation((params) => {
                sentBodies.push(params);
                return 'res';
            });

        await exampleQueuer._run();

        expect(sentBodies.length).toEqual(1);
        expect(sentBodies[0].worker).toEqual('CrossbeamPollWorker');
        expect(sentBodies[0].worker.message.integrationId).toEqual(mockedIntegration.id);
    });
});
