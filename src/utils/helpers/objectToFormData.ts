const objectToFormData = (data: Record<string, string | File>) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });
    return formData;
};

export default objectToFormData;
