const request = require('supertest');
const { createApp } = require('../../app');
const userRoute = require('../../src/routers/user');
const authRoute = require('../../src/routers/auth');
const demoRoute = require('../../src/routers/demo');
const ModuleManager = require('@friggframework/api-module-salesforce/manager')
const { default: mongoose } = require('mongoose');

const app = createApp((app) => {
    app.use(userRoute);
    app.use(authRoute);
    app.use(demoRoute);
});

let getIntegrationsBaselineResponse = {
    entities: {
        authorized: [],
        options: [
            {
                display: {
                    description: 'Sales & CRM',
                    detailsUrl: 'https://salesforce.com',
                    icon: 'https://friggframework.org/assets/img/salesforce.jpeg',
                    name: 'Salesforce',
                },
                hasUserConfig: false,
                isMany: false,
                requiresNewEntity: false,
                type: 'salesforce',
            },
        ],
        primary: 'salesforce',
    },
    integrations: [],
};

describe('Users process tests', () => {
    let credentials = { username: 'demo@lefthook.com', password: 'demo' };
    let token;

    beforeAll(() => {
        mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    it('Creates a user', async () => {
        await request(app)
            .post('/user/create')
            .send(credentials)
            .then((response) => {
                token = response.body.token;
                expect(response.statusCode).toEqual(201);
                expect(response.body.token).toBeTruthy();
                expect(response.body.token).toEqual(token);
            });
    });

    it('Logs in as the created user', async () => {
        await request(app)
            .post('/user/login')
            .send(credentials)
            .then((response) => {
                token = response.body.token;
                expect(response.statusCode).toEqual(201);
                expect(response.body.token).toBeTruthy();
            });
    });

    it('Lists user baseline integrations', async () => {
        await request(app)
            .get('/api/integrations')
            .set('Authorization', 'Bearer ' + token)
            .then((response) => {
                expect(response.statusCode).toEqual(200);
                expect(response.body).toMatchObject(
                    getIntegrationsBaselineResponse
                );
            });
    });

    it('Triggers API authorization process', async () => {
        await request(app)
            .get(
                '/api/authorize?entityType=salesforce&connectingEntityType=connectwise'
            )
            .set('Authorization', 'Bearer ' + token)
            .then((response) => {
                expect(response.statusCode).toEqual(200);
                expect(response.body).toHaveProperty('type', 'oauth2');
                expect(response.body).toHaveProperty('url');
                apiExternalAuthorizationUrl = response.body.url;
            });
    });

    it('Registers API authorization process', async () => {
        jest
            .spyOn(ModuleManager.prototype, 'processAuthorizationCallback')
            .mockImplementation(() => {
                return 'Hello this is a token';
            });

        const payload = {
            entityType: 'salesforce',
            data: {
                code: 'aPrx6oJIsUGUE2NdOeCvZslBS_50cxJ1xlCB6goephFgcc3xAxEQiyE3I9Yn9TLrHzzUxsKZ_A==',
            },
        };

        await request(app)
            .post('/api/authorize')
            .set('Authorization', 'Bearer ' + token)
            .set('Referer', 'http://localhost:3000/')
            .send(payload)
            .then((res) => {
                expect(res.statusCode).toEqual(200);
            });
    });
});
