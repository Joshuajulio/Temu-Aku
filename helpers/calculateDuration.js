function getDuration(givenDate){
    const diff = Math.abs(new Date() - new Date(givenDate))
    const minutes = Math.floor((diff/1000)/60);
    if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (minutes < 1440) {
        const hour = Math.floor(minutes/60)
        return `${hour} hours ago`
    } else if (minutes < 10080) {
        const day = Math.floor(minutes/1440)
        return `${day} days ago`
    } else {
        const month = Math.floor(minutes/43200)
        return `${month} months ago`
    }
}

module.exports = {getDuration}