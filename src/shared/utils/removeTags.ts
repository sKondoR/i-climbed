export const removeTags = (text?: string) => {
    return text?.replaceAll(/<[^>]*>/g, '');
};