export interface IImage {
    id: string;
    uniqId?: string;
    imageData?: Buffer | string;
    error?: string;
}
