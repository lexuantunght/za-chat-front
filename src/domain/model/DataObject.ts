export interface DataObject {
    [index: string]: string | File | Blob | undefined | Array<File | undefined>;
}
