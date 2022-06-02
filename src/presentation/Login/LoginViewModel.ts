import { LoginData } from '../../domain/model/LoginData';
import { Login } from '../../domain/usecase/authentication/Login';
import { useMultilingual } from '../../hooks/translation';

const LoginViewModel = () => {
    const { t } = useMultilingual();

    const loginUseCase = new Login();

    const login = async (data: LoginData) => {
        await loginUseCase.invoke(data);
    };

    return {
        login,
        t,
    };
};

export default LoginViewModel;
