import BaseController from '../BaseController';
import { Login } from '../../domain/usecase/authentication/Login';
import { LoginData } from '../../domain/model/LoginData';
import { Authorize } from '../../domain/usecase/authentication/Authorize';
import { setUserData } from '../../utils/redux/reducer';

class LoginController extends BaseController {
    private loginUseCase;
    private authorizeUseCase;
    constructor() {
        super();
        this.loginUseCase = new Login();
        this.authorizeUseCase = new Authorize();
    }

    public login = (data: LoginData, successCallback?: () => void, finishCallback?: () => void) => {
        this.loginUseCase
            .invoke(data)
            .then((userData) => {
                this.dispatch(setUserData(userData));
                successCallback?.();
            })
            .catch(this.handleError)
            .finally(finishCallback);
    };

    public authorize = () => {
        this.authorizeUseCase.invoke().then((userData) => this.dispatch(setUserData(userData)));
    };
}

export default LoginController;
