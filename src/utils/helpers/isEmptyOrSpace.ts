export default function isEmptyOrSpace(str: string) {
    return str === null || str.match(/^ *$/) !== null;
}
