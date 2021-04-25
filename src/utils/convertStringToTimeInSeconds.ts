export const convertStringToTimeInSeconds = (duration: string): number => {
    const [hours, minutes, seconds] = duration.split(':').map(unit => +unit);
    return (hours * 3600) + (minutes * 60) + seconds;
}