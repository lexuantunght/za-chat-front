import { domain } from '../config/appConfig';
import Cookies from 'js-cookie';

const get = (name: string) => {
    return Cookies.get(name);
};

const set = (name: string, value: any) => {
    Cookies.set(name, value, { domain: domain });
};

const remove = (name: string) => {
    Cookies.remove(name, {
        path: '/',
        domain: domain,
    });
};

const CookiesHelper = {
    get,
    set,
    remove,
};

export default CookiesHelper;