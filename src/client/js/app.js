import { functionsIn } from "lodash";

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
   
        postWeather("/addGeo", 
        { city:cityName, date: departureDate })
    // })      
           
     
        
    // }
};


/* POST */
const postWeather = async (url="", data = {} )=>{
    console.log("hello")
    const response = await fetch(url, {
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

/* Update UI */

async function updateUI(res) {
        console.log(res);

        let departureDate = document.getElementById("date").value;
        document.getElementById("d-day").innerHTML = departureDate;
        
        // get the selectors by Id, and update property dynamically
        document.getElementById("days").innerHTML = dayCount(departureDate);
        console.log(dayCount(departureDate));
        document.getElementById("city").innerHTML = res.geonames[0].name; //city
        document.getElementById("country").innerHTML = res.geonames[0].countryName; //country
        document.getElementById("latitude").innerHTML = res.geonames[0].lat; //latitude
        document.getElementById("longitude").innerHTML = res.geonames[0].lng; //longitude
        document.getElementById("weather").classList.add("#weather");      
}

/*count down*/
const dayCount = function(departureDate) {
    // const departureDate = document.getElementById("date").value;
    console.log("departuredate", departureDate);
    const month = departureDate.slice(0,2);
    console.log(month);
    const day = departureDate.slice(3,5);
    console.log(day);
    const year = departureDate.slice(6,10);
    console.log(year);
    const theDate = new Date(year, month - 1, day);
    console.log(theDate);
    const today = new Date();
    console.log("big",theDate - today);

    if (theDate >= today) {
        return (Math.round((theDate - today) / (1000 * 60 * 60 * 24 ))+1);
    } else {
        alert ("Please enter future date.")
    }
}

/* Check leapyear */
const leapYear = function(yearNow) {
    let totalDate;
    if (yearNow % 4 === 0) {
        if (yearNow % 100 === 0) {
            if (yearNow % 400 === 0) {
                 return true;
            } else {
                return false;
            }
        } else {
            totalDate === 366;
        }
    } else {
        totalDate === 365;
    }
}



export {performAction}
export {updateUI}