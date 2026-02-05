export const removeTags = (text?: string) => {
    return text?.replace(/<[^>]*>/g, '');
};