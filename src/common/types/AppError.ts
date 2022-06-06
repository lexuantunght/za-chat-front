type AppError = {
    message?: string;
    response?: {
        data?: {
            message?: string;
        };
    };
};

export default AppError;
