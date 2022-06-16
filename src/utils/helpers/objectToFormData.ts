import { DataObject } from '../../domain/model/DataObject';

const objectToFormData = (data: DataObject) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
            Array.from(value).forEach((subValue) => {
                if (subValue) {
                    formData.append(key, subValue);
                }
            });
        } else if (value) {
            formData.append(key, value);
        }
    });
    return formData;
};

export default objectToFormData;
