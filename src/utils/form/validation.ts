import * as Yup from 'yup';

export const useValidation = (provider = Yup) => {
    return provider;
};
