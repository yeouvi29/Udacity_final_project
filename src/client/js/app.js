import 'regenerator-runtime/runtime'

const { default: fetch } = require("node-fetch");

function getData (event) {
    event.preventDefault();
    if(document.getElementById("city-image").firstChild){
        document.getElementById("city-image").removeChild(document.getElementById("city-image").childNodes[0]);
    }
        console.log("event",event)
        const cityName = document.getElementById("city-input").value;
        let departureDate = document.getElementById("start-date").value;
        let endDate = document.getElementById("end-date").value;

        /*Check date format with checkForDate function*/
        if (Client.checkForDate(departureDate, endDate)) {
                /*Send input data to server*/
                postWeather( 
                { city:cityName, startDate: departureDate, endDate: endDate })
                .then(
                  data =>  updateUI(data)
                )
        } else {
            alert("Please enter the end date to the later than the departure date.");
        }
};

/* POST */
const postWeather = async (data = {}) => {
    /*Receive data from server*/
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
    const dDay = new Date(receivedData[0].startDate);
    const eDay = new Date(receivedData[0].endDate);
    const timeDiffFromToday = dDay.getTime() - date.getTime();
    const timeDiffFromDDay = eDay.getTime() - dDay.getTime();
    const remainingDaysFromToday = Math.ceil(timeDiffFromToday / ( 1000 * 60 * 60 * 24));
    const remainingDaysFromDDay = Math.ceil(timeDiffFromDDay / ( 1000 * 60 * 60 * 24));

    /*Create image element for adding photo from pixaBay source*/
    const img = document.createElement("img");
    img.setAttribute('src', receivedData[2].photo);
    img.setAttribute('id', "cityphoto");
    
    /*Update UI with updated data*/
    document.getElementById("city-image").appendChild(img);
    document.getElementById("cityphoto").style.cssText = "max-width:100%;max-height:100%;min-width:100%;min-height:100%;display:block;";
    document.getElementById("location").innerHTML = receivedData[0].city + ", " + receivedData[0].country;
    document.getElementById("city-info").innerHTML = "City Information";
    document.getElementById("lat-lon").innerHTML = "lat: " + receivedData[0].latitude + " & lon: " + receivedData[0].longitude;
    document.getElementById("weather").innerHTML = "High Temp.: " + receivedData[1].tempHigh + "F     " + "Low Temp.: " + receivedData[1].tempLow + "F";

    //  Change text depending on travel period
    if(remainingDaysFromDDay === 1) {
        document.getElementById("period").innerHTML = dateFormatTransform(receivedData[0].startDate) + " - " + dateFormatTransform(receivedData[0].endDate) + "(" + remainingDaysFromDDay + " day)";
    } else {
        document.getElementById("period").innerHTML = dateFormatTransform(receivedData[0].startDate) + " - " + dateFormatTransform(receivedData[0].endDate) + "(" + remainingDaysFromDDay + " days)";
    }

    // Change text depending on remaining days
    if(remainingDaysFromToday === 1) {
        document.getElementById("count-down").innerHTML = remainingDaysFromToday + " day away to";
    } else if(remainingDaysFromToday === 0) {
        document.getElementById("count-down").innerHTML = "Only a few hours away to";
    } else {
        document.getElementById("count-down").innerHTML = remainingDaysFromToday + " days away to";
    }
}

// Change date format yyyy-mm-dd to mm/dd/yyyy
const dateFormatTransform = yyyymmdd => {
    const transformedDate = (yyyymmdd).slice(5,7) + "/" + (yyyymmdd).slice(8,10) + "/" + (yyyymmdd).slice(0,4)
    return transformedDate;
}




export {getData}

