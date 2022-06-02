import React from 'react';
import { RegisterData } from '../../domain/model/RegisterData';
import { Register } from '../../domain/usecase/authentication/Register';
import useMultilingual from '../../utils/multilingual';
import { navigate } from '../../utils/app/navigation';

const RegisterViewModel = () => {
    const [isShowSuccessMsg, setIsShowSuccessMsg] = React.useState(false);
    const { t } = useMultilingual();

    const registerUseCase = new Register();

    const register = async (data: RegisterData) => {
        return registerUseCase.invoke(data);
    };

    const hideSuccessMsg = () => {
        setIsShowSuccessMsg(false);
    };

    return {
        register,
        isShowSuccessMsg,
        hideSuccessMsg,
        t,
        navigate,
    };
};

export default RegisterViewModel;
