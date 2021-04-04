const dotenv = require("dotenv")
dotenv.config()

const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(cors());

const port = 8081;
app.listen(port, function() {
    console.log("server running")
    console.log(`running on local host: ${port}`);
});

//Get route
app.get("/", res => {
    res.sendFile(path.resolve("dist/index.html"))
})

app.post("/addGeo", async (req, res) => {
    getGeoInfo(req)
    .then(data => getWeatherInfo(data))
    .then(weatherData => getPhoto(weatherData))
    .then(finalData => res.send(finalData))
})

const getGeoInfo = async (req) => {
    const geoBaseURL = 'http://api.geonames.org/searchJSON?q='
    const geoAPI = process.env.GEO_KEY
    const maxRows = '&maxRows=10&username='

    try {
        const response =  await axios({
        method: "post",
        url: geoBaseURL + req.body.city + maxRows + geoAPI
        })
        const geoData = {
            city: req.body.city,
            date: req.body.date,
            city: response.data.geonames[0].name,
            country: response.data.geonames[0].countryName,
            latitude: response.data.geonames[0].lat,
            longitude: response.data.geonames[0].lng
        }
        return geoData;      
    } catch (err) {
        console.log("error", err)
    }   
}

const getWeatherInfo = async (geoData) => {
    console.log(geoData);
    const weaBaseURL = 'https://api.weatherbit.io/v2.0/normals?key=';
    const weaAPI = process.env.WEATHER_KEY;
    const day = geoData.date.slice(0,2);
    const nextDay = "0" + (parseInt(day) + 1).toString();
    const month = geoData.date.slice(3,5);
    const year = geoData.date.slice(6,10);
    const changeDateFormat = month + "-" + day;
    const setNextDay = month + "-" + nextDay;
    const lat = "&lat=" + (Math.round(geoData.latitude * 100) / 100);
    const lon = "&lon=" + (Math.round(geoData.longitude* 100) / 100);
    const date = "&start_day=" + changeDateFormat + "&end_day=" + setNextDay + "&units=I";

    try {
        const response = await axios({
            method: "post",
            url: weaBaseURL + weaAPI + lat + lon + date
        })
        const temperature = {
            tempHigh: response.data.data[0].max_temp,
            tempLow: response.data.data[0].min_temp
        }
        let weatherData = {
            geoData: geoData,
            temperature: temperature
        }
        // console.log("weatherData", weatherData)
        return weatherData;        
    } catch (err) {
        console.log("error", err)
    }   
}

const getPhoto = async (weatherData) => {
    console.log("real", weatherData);
    const pixaBayURL = 'https://pixabay.com/api/?key=';
    const photoAPI = process.env.PIXABAY_KEY;
    const q = "&q=" + encodeURIComponent(weatherData.geoData.city);
    const otherSetting = "&editors_choice=true&image_type=photo"

    try {
        const response =  await axios({
        method: "post",
        url: pixaBayURL + photoAPI + q + otherSetting
        })
        const photoData = {photo: ""};
        if (response.data.total === 0) {
            photoData.photo = "https://pixabay.com/photos/beach-beautiful-beetle-classic-car-1853939/"
        } else {
            photoData.photo = response.data.hits[0].webformatURL
        }
        // console.log("response", response);
        weatherData.photoData = photoData
        console.log("weatherData", weatherData)
        return weatherData;       
    } catch (err) {
        console.log("error", err)
    }   
}