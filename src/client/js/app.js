import { data } from "browserslist";

const { default: fetch } = require("node-fetch");

function performAction(e) {
    e.preventDefault()
    const day = new Date();
    const today = (day.getMonth()+1)+'.'+ day.getDate()+'.'+ day.getFullYear();  
   
    const zipText = document.getElementById("zip").value;
    
    console.log("it's clicked")
    if (Client.checkForZip(zipText)) {
        alert("I can't find your zip code.\n Please enter your zip code again.");
    } else {
        console.log(zipText);
        postWeather("/addWeather", { zip:zipText })
    }
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
        updateUI(newData)
        console.log("haha");
    } catch(error) {
        console.log("error", error);
    }
}

/* Update UI */

async function updateUI(res) {
   
   
       
        console.log(res);
        const imageUrl = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png" 
        const day = new Date();
        const today = (day.getMonth()+1)+'.'+ day.getDate()+'.'+ day.getFullYear();  
        const feelings = document.getElementById("feelings").value;
        // get the selectors by Id, and update property dynamically
        console.log(imageUrl);
        document.getElementById("date").innerHTML = today;
        document.getElementById("temp").innerHTML = res.main.temp + "F";
        document.getElementById("weather").innerHTML = res.weather[0].main;
        document.getElementById("weather").classList.add("#weather");
        document.getElementById("show-feeling").innerHTML = feelings;
        document.getElementById("weather-img").src = imageUrl; 
}


export {performAction}
export {updateUI}