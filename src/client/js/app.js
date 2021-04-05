const { default: fetch } = require("node-fetch");



function getData (event) {
    event.preventDefault()
   
    const cityName = document.getElementById("city-input").value;
    let departureDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;

    console.log("it's clicked")
    if (Client.checkForDate(departureDate) && Client.checkForDate(endDate)) {
            postWeather( 
            { city:cityName, startDate: departureDate, endDate: endDate })
            .then(
              data =>  updateUI(data)
            )
    } else {
        alert("I can't find your zip code.\n Please enter your zip code again.");
    }
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
        // newData: data from three websites
        const travelData = await response.json();
        return travelData;
    } catch(error) {
        console.log("error", error);
    }
}

/* Update UI */
const updateUI = receivedData => {
    console.log("receivedData",receivedData)
    /*Calculate remaining date*/
    const date = new Date();
    const dDay = new Date(receivedData.geoData.startDate);
    const timeDifference = dDay.getTime() - date.getTime();
    const remainingDays = Math.ceil(timeDifference / ( 1000 * 60 * 60 * 24));

    /*create image element for adding photo from pixaBay source*/
    const img = document.createElement("img");
    img.setAttribute('src', receivedData.photoData.photo);
    img.setAttribute('id', "cityphoto");
    

    document.getElementById("city-image").appendChild(img);
    document.getElementById("cityphoto").style.cssText = "max-width:100%;max-height:100%;display:block;margin:auto;opacity:1";
    document.getElementById("count-down").innerHTML = remainingDays + " days away to";
    document.getElementById("location").innerHTML = receivedData.geoData.city + ", " + receivedData.geoData.country;
    document.getElementById("period").innerHTML = receivedData.geoData.startDate + " - " + receivedData.geoData.endDate;
    document.getElementById("city-info").innerHTML = "City Information";
    document.getElementById("lat-lon").innerHTML = "lat: " + receivedData.geoData.latitude + " & lon: " + receivedData.geoData.longitude;
    document.getElementById("weather").innerHTML = "High Temp.: " + receivedData.temperature.tempHigh + "F     " + "Low Temp.: " + receivedData.temperature.tempLow + "F";
}

export {getData}

