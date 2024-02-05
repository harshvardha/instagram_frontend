export const timeAgo = (timestamp) => {
    const now = Date.now();
    const timeStamp = new Date(timestamp).getTime();
    const secondsAgo = Math.floor((now - timeStamp) / 1000);

    if (secondsAgo < 60) {
        if (secondsAgo < 0)
            return `${secondsAgo * -1}s`;
        else
            return `${secondsAgo}s`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo}m`;
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo}h`;
    } else if (secondsAgo < 604800) {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo}d`;
    } else {
        const weeksAgo = Math.floor(secondsAgo / 604800); // 7 days in seconds
        return `${weeksAgo}w`;
    }
}