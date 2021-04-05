const checkForDate = (inputText => {
    const checkText = /\//g
    if (checkText.test(inputText) && (inputText.length === 10)) {
        return true;
    } else {
        return false;
    }

})

export {checkForDate}