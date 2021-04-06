const checkForDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if(startDate >= endDate) {
        return false;
    } else {
        return true;
    }
}

export {checkForDate}