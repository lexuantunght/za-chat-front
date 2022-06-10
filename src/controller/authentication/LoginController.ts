import BaseController from '../BaseController';
import { Login } from '../../domain/usecase/authentication/Login';
import { LoginData } from '../../domain/model/LoginData';
import { Authorize } from '../../domain/usecase/authentication/Authorize';
import { setLoading } from '../../presentation/Login/reducer';

class LoginController extends BaseController {
    private loginUseCase;
    private authorizeUseCase;
    constructor() {
        super();
        this.loginUseCase = new Login();
        this.authorizeUseCase = new Authorize();
    }

    public login = (data: LoginData, successCallback?: () => void, finishCallback?: () => void) => {
        this.dispatch(setLoading(true));
        this.loginUseCase
            .invoke(data)
            .then(successCallback)
            .catch((err) => {
                this.clearLoading();
                this.handleError(err);
            })
            .finally(finishCallback);
    };

    public authorize = (successCallback?: CallableFunction) => {
        this.dispatch(setLoading(true));
        this.authorizeUseCase
            .invoke()
            .then(() => successCallback?.())
            .catch(this.clearLoading);
    };

    public clearLoading = () => {
        this.dispatch(setLoading(false));
    };
}

export default LoginController;
