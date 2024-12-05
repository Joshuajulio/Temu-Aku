function getDuration(givenDate){
    const diff = Math.abs(new Date() - new Date(givenDate))
    const minutes = Math.floor((diff/1000)/60);
    if (minutes < 60) {
        return `${minutes} minutes ago`
    } else {
        const hour = Math.floor(minutes/60)
        return `${hour} hours ago`
    }
}

module.exports = {getDuration}