const { IntegrationManager: Parent } = require('@friggframework/integrations');
const EntityManager = require('../entities/EntityManager');

const salesforceIntegrationManager = require('./SalesforceIntegrationManager');

class IntegrationManager extends Parent {
    static integrationManagerClasses = [
        salesforceIntegrationManager,
    ];

    static integrationTypes = IntegrationManager.integrationManagerClasses.map(
        (ManagerClass) => ManagerClass.getName()
    );

    constructor(params) {
        super(params);
    }

    static async getInstanceFromIntegrationId(params) {
        const integration = await IntegrationManager.getIntegrationById(
            params.integrationId
        );
        let { userId } = params;
        if (!integration) {
            throw new Error(
                `No integration found by the ID of ${params.integrationId}`
            );
        }

        if (!userId) {
            userId = integration.user._id.toString();
        } else if (userId !== integration.user._id.toString()) {
            throw new Error(
                `Integration ${
                    params.integrationId
                } does not belong to User ${userId}, ${integration.user.id.toString()}`
            );
        }

        const integrationManagerIndex =
            IntegrationManager.integrationTypes.indexOf(
                integration.config.type
            );
        const integrationManagerClass =
            IntegrationManager.integrationManagerClasses[
                integrationManagerIndex
                ];

        const instance = await integrationManagerClass.getInstance({
            userId,
            integrationId: params.integrationId,
        });
        instance.integration = integration;
        instance.delegateTypes.push(...integrationManagerClass.Config.events); // populates the events available
        // Need to get special primaryInstance because it has an extra param to pass in
        instance.primaryInstance =
            await EntityManager.getEntityManagerInstanceFromEntityId(
                instance.integration.entities[0],
                instance.integration.user
            );
        // Now we can use the general ManagerGetter
        instance.targetInstance =
            await EntityManager.getEntityManagerInstanceFromEntityId(
                instance.integration.entities[1],
                instance.integration.user
            );
        instance.delegate = instance;
        return instance;
    }
}

module.exports = IntegrationManager;
