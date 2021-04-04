const { default: fetch } = require("node-fetch");



function performAction(event) {
    event.preventDefault()
   
    const cityName = document.getElementById("city-input").value;
    let departureDate = document.getElementById("date").value;

    console.log("it's clicked")
    // if (Client.checkForZip(zipText)) {
    //     alert("I can't find your zip code.\n Please enter your zip code again.");
    // } else {
    // (function (data) {
   
        postWeather( 
        { city:cityName, date: departureDate })
        updateUI()
};


/* POST */
const postWeather = async (data = {}) => {
    console.log("hello")
    const response = await fetch("/addGeo", {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),     
    });

    try {
        // newData: data from weather site
        const newData = await response.json();
        // updateUI(newData)
        console.log("newdata",newData);
        return newData;
    } catch(error) {
        console.log("error", error);
    }
}

// /* Update UI */
const updateUI = async (url = "") => {
    const response = await fetch(url);
    console.log(response.body)

    try {
        const dataLocation = request.json();
        console.log(dataLocation);
    } catch(error) {
        console.log("error", error);
    }
}

export {performAction}
