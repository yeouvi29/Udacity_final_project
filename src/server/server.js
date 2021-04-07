const dotenv = require("dotenv")
dotenv.config()

const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")

let tripData = [];

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(cors());

app.get("/", res => {
    res.sendFile("/index.html")
})

app.post("/addGeo", async (req, res) => {
    getGeoInfo(req)
    .then(data => getWeatherInfo(data))
    .then(weatherData => getPhoto(weatherData))
    .then(finalData => {
        tripData.push(finalData) 
        res.send(finalData)
    })
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
            startDate: req.body.startDate,
            endDate: req.body.endDate,
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
    const startDate = geoData.startDate.slice(5,10);
    console.log(startDate);
    const endDate = geoData.endDate.slice(5,10);
    const lat = "&lat=" + (Math.round(geoData.latitude * 100) / 100);
    const lon = "&lon=" + (Math.round(geoData.longitude* 100) / 100);
    const date = "&start_day=" + startDate + "&end_day=" + endDate + "&units=I";

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
        return weatherData;        
    } catch (err) {
        console.log("error", err)
    }   
}

const getPhoto = async (weatherData) => {
    const pixaBayURL = 'https://pixabay.com/api/?key=';
    const photoAPI = process.env.PIXABAY_KEY;
    const cityQ = "&q=" + encodeURIComponent(weatherData.geoData.city);
    const countryQ =   "&q=" + encodeURIComponent(weatherData.geoData.country);
    const otherSetting = "&editors_choice=true&image_type=photo"

    try {
        const response =  await axios({
        method: "post",
        url: pixaBayURL + photoAPI + cityQ + otherSetting
        })
        const photoData = {photo: ""};
        if (response.data.total === 0) {
            try {
                const res = await axios({
                method: "post",
                url: pixaBayURL + photoAPI + countryQ + otherSetting
                })
                photoData.photo = res.data.hits[0].webformatURL
                weatherData.photoData = photoData
                console.log("weatherData", weatherData)
                return weatherData;   
            } catch (err) {
                console.log("error", err)
            } 
        } else {
            photoData.photo = response.data.hits[0].webformatURL
        }
        weatherData.photoData = photoData
        console.log("weatherData", weatherData)
        return weatherData;       
    } catch (err) {
        console.log("error", err)
    }   
}

module.exports = app