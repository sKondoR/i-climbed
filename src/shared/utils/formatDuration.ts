export const formatDuration = (start: Date, end: Date) => {
    if (start instanceof Date
        && end instanceof Date
        && !Number.isNaN(start.getTime())
        && !Number.isNaN(end.getTime())
    ) {
        const durationMs = end.getTime() - start.getTime();
        const minutes = Math.floor(durationMs / 1000 / 60);
        const seconds = Math.floor((durationMs / 1000) % 60);
        return `${minutes} мин ${seconds} сек`;
    } else {
        console.error('Некорректные даты');
    }
};