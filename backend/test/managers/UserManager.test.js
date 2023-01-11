/**
 * Tests UserManager class
 *
 * @group unit/classes/UserManager
 */
const fetch = require('node-fetch');
const UserManager = require('../../src/managers/UserManager');
const { User } = require('../../src/models/User');
const { connectToDatabase } = require('@friggframework/database/mongo');

const loginCredentials = { username: 'admin', password: 'password1' };

describe('UserManager', () => {
    beforeAll(async () => {
        await connectToDatabase()
    })
    beforeEach(async () => {
        this.manager = await UserManager.createIndividualUser(loginCredentials);
    });
    afterEach(async () => {
        await User.deleteMany()
    });
    test('should create a login token', async () => {
        console.log('bar')
        const token = await this.manager.createUserToken();
        await new UserManager({ token });
    });

    it('should login a user', async () => {
        const testManager = await UserManager.loginUser(loginCredentials);
        expect(testManager.individualUser).not.toBeNull();
    });

    it('should not login a user with invalid password', async () => {
        await expect(
            UserManager.loginUser({
                username: loginCredentials.username,
                password: 'password2',
            })
        ).rejects.toThrow(Error);
    });

    it('should not login a user with invalid username', async () => {
        await expect(
            UserManager.loginUser({
                username: 'admin1',
                password: loginCredentials.password,
            })
        ).rejects.toThrow(Error);
    });
});
