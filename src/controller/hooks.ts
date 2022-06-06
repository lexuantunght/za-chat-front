const useController = <T>(constructor: new () => T) => {
    return new constructor();
};

export default useController;
