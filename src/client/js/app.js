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

        // Check date format with checkForDate function
        if (Client.checkForDate(departureDate, endDate)) {
                console.log(departureDate,endDate, cityName);
                 // Send input data to server
                postWeather( 
                { city:cityName, startDate: departureDate, endDate: endDate })
                .then(
                  data => { 
                      updateUI(data)
                      console.log(data)
                  }
                )
        } else {
            alert("Please enter the end date to the later than the departure date.");
        }
};

/* POST */
const postWeather = async (data = {}) => {
    // console.log(data);
    // let body = JSON.stringify(data);
    // console.log(body);
    const response = await fetch("/addGeo", {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),     
    });

    try {
        // travelData: data from three websites
        const travelData = await response.json();
        console.log(travelData);
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
    const eDay = new Date(receivedData.geoData.endDate);
    const timeDiffFromToday = dDay.getTime() - date.getTime();
    const timeDiffFromDDay = eDay.getTime() - dDay.getTime();
    const remainingDaysFromToday = Math.ceil(timeDiffFromToday / ( 1000 * 60 * 60 * 24));
    const remainingDaysFromDDay = Math.ceil(timeDiffFromDDay / ( 1000 * 60 * 60 * 24));

    /*Create image element for adding photo from pixaBay source*/
    const img = document.createElement("img");
    img.setAttribute('src', receivedData.photoData.photo);
    img.setAttribute('id', "cityphoto");
    
    /*Update UI with updated data*/
    document.querySelector(".result").style.opacity = 1;
    document.getElementById("city-image").appendChild(img);
    document.getElementById("cityphoto").style.cssText = "max-width:100%;max-height:100%;min-width:100%;min-height:100%;display:block;";
    
    const imageUrl = "https://weatherbit.io/static/img/icons/" + receivedData.temperature.tempIcon + ".png" 
    const newImage = document.createElement("img");
    newImage.src = imageUrl;
    document.getElementById("location").innerHTML = receivedData.geoData.city + ", " + receivedData.geoData.country;
    document.getElementById("city-info").childNodes[0].innerHTML = "City Information";
    console.log(document.getElementById("city-info").firstElementChild);
    document.getElementById("city-info").firstElementChild.innerHTML = "lat: " + receivedData.geoData.latitude + " & lon: " + receivedData.geoData.longitude;
    document.getElementById("city-info").lastElementChild.innerHTML = "Temp.: " + receivedData.temperature.temp + "F     ";
    document.getElementById("weather").appendChild(newImage); 
    //  Change text depending on travel period
    if(remainingDaysFromDDay === 1) {
        document.getElementById("period").innerHTML = dateFormatTransform(receivedData.geoData.startDate) + " - " + dateFormatTransform(receivedData.geoData.endDate) + "(" + remainingDaysFromDDay + " day)";
    } else {
        document.getElementById("period").innerHTML = dateFormatTransform(receivedData.geoData.startDate) + " - " + dateFormatTransform(receivedData.geoData.endDate) + "(" + remainingDaysFromDDay + " days)";
    }

    // Change text depending on remaining days
    if(remainingDaysFromToday === 1){
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

