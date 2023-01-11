const { ModuleManager, Entity } = require('@friggframework/module-plugin');
const primaryEntity = require('./ConnectWiseManager');
const salesforceEntity = require('./SalesforceManager');


class EntityManager {
    static primaryEntityClass = primaryEntity;

    static entityManagerClasses = [
        primaryEntity,
        salesforceEntity,
    ];

    static entityTypes = EntityManager.entityManagerClasses.map(
        (ManagerClass) => ManagerClass.getName()
    );

    static async getEntitiesForUser(userId) {
        const results = [];
        for (const Manager of this.entityManagerClasses) {
            results.push(...(await Manager.getEntitiesForUserId(userId)));
        }
        return results;
    }

    constructor() {
        // ...
    }

    static checkIsValidType(entityType) {
        const indexOfEntity = EntityManager.entityTypes.indexOf(entityType);
        return indexOfEntity >= 0;
    }

    static getEntityManagerClass(entityType = '') {
        const normalizedType = entityType.toLowerCase();

        const indexOfEntityType =
            EntityManager.entityTypes.indexOf(normalizedType);
        if (!EntityManager.checkIsValidType(normalizedType)) {
            throw new Error(
                `Error: Invalid entity type of ${normalizedType}, options are ${EntityManager.entityTypes.join(
                    ', '
                )}`
            );
        }

        const managerClass =
            EntityManager.entityManagerClasses[indexOfEntityType];

        if (!(managerClass.prototype instanceof ModuleManager)) {
            throw new Error('The Entity is not an instance of ModuleManager');
        }

        return managerClass;
    }

    static async getEntityManagerInstanceFromEntityId(entityId, userId) {
        const entity = await Entity.findById(entityId);
        let entityManagerClass;
        for (const Manager of this.entityManagerClasses) {
            if (entity instanceof Manager.Entity) {
                entityManagerClass = Manager;
            }
        }
        const instance = await entityManagerClass.getInstance({
            userId,
            entityId,
        });
        return instance;
    }
}

module.exports = EntityManager;
