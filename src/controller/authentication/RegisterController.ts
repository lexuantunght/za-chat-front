import BaseController from '../BaseController';
import { Register } from '../../domain/usecase/authentication/Register';
import { RegisterData } from '../../domain/model/RegisterData';

class RegisterController extends BaseController {
    private registerUseCase;
    constructor() {
        super();
        this.registerUseCase = new Register();
    }

    public register = (data: RegisterData) => {
        return this.registerUseCase.invoke(data);
    };
}

export default RegisterController;
