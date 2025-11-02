export interface Attachment {
    id?: string;
    file: File;
    fileSRC: string | ArrayBuffer;
    fileAttributes: {
        fileName: string
        size: string
    }
}