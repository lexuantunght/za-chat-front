import moment from 'moment';

export const fromNow = (
    value?: string | Date,
    locale = 'vi',
    withoutSuffix = false,
    provider = moment
) => provider(value).locale(locale).fromNow(withoutSuffix);

export const toDate = (value?: string | Date, provider = moment) => {
    return provider(value).toDate();
};

export const format = (value?: string | Date, formatter?: string, provider = moment) => {
    return provider(value).format(formatter);
};
