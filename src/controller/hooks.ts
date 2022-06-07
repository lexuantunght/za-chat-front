const controllers = new Map();

const useController = <T>(constructor: new () => T, isNewInstance = false) => {
    if (isNewInstance) {
        return new constructor();
    }
    if (!controllers.get(constructor)) {
        controllers.set(constructor, new constructor());
    }
    return controllers.get(constructor) as T;
};

export default useController;
