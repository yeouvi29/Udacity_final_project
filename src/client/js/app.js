import { data } from "browserslist";

const { default: fetch } = require("node-fetch");

function performAction(e) {
    e.preventDefault()
   
    const zipText = document.getElementById("zip").value;
    
    console.log("it's clicked")
    // if (Client.checkForZip(zipText)) {
    //     alert("I can't find your zip code.\n Please enter your zip code again.");
    // } else {
        console.log(zipText);
        postWeather("/addGeo", { zip:zipText })
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
        updateUI(newData)
        console.log("haha");
    } catch(error) {
        console.log("error", error);
    }
}

/* Update UI */

async function updateUI(res) {
   
   
       
        console.log(res);
        const day = new Date();
        const today = (day.getMonth()+1)+'.'+ day.getDate()+'.'+ day.getFullYear();  
        const feelings = document.getElementById("feelings").value;
        // get the selectors by Id, and update property dynamically
        document.getElementById("date").innerHTML = today;
        document.getElementById("temp").innerHTML = res.geonames[0].lat; //latitude
        document.getElementById("weather").innerHTML = res.geonames[0].lng; //longitude
        document.getElementById("weather").classList.add("#weather");
        document.getElementById("show-feeling").innerHTML = feelings;
}


export {performAction}
export {updateUI}