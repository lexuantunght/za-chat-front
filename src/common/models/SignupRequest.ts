type SignupRequest = {
    name: string;
    avatar?: File;
    phoneNumber: string;
    username: string;
    password: string;
};

export default SignupRequest;
