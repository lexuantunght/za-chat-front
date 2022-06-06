import BaseController from './BaseController';
import { Authorize } from '../domain/usecase/authentication/Authorize';
import { setUserData } from '../utils/redux/reducer';

class AppController extends BaseController {
    private authorizeUseCase;
    constructor() {
        super();
        this.authorizeUseCase = new Authorize();
    }

    public authorize = () => {
        this.authorizeUseCase.invoke().then((user) => this.dispatch(setUserData(user)));
    };
}

export default AppController;
