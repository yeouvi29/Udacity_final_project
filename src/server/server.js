const dotenv = require("dotenv")
dotenv.config()

// const path = require("path")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(cors());

module.exports = app

projectData = {};
const totalData = [];

app.get("/", res => {
    res.sendFile("/index.html")
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
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            country: response.data.geonames[0].countryName,
            latitude: response.data.geonames[0].lat,
            longitude: response.data.geonames[0].lng
        }
        projectData = geoData;
        totalData.push(geoData);
        console.log(totalData)
        return totalData;      
    } catch (err) {
        console.log("error", err)
    }   
}

const getWeatherInfo = async () => {
    console.log(totalData);
    const weaBaseURL = 'https://api.weatherbit.io/v2.0/normals?key=';
    const weaAPI = process.env.WEATHER_KEY;
    const startDate = dateTransform(totalData[0].startDate);
    console.log(startDate);
    const endDate = dateTransform(totalData[0].endDate);
    const lat = "&lat=" + (Math.round(totalData[0].latitude * 100) / 100);
    const lon = "&lon=" + (Math.round(totalData[0].longitude* 100) / 100);
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
        projectData = temperature
        totalData.push(projectData);
        console.log(totalData)
        return totalData;       
    } catch (err) {
        console.log("error", err)
    }   
}

function dateTransform(date) {
    const day = date.slice(0,2);
    const month = date.slice(3,5);
    const changeDateFormat = month + "-" + day;
    return changeDateFormat;
}

const getPhoto = async () => {
    const pixaBayURL = 'https://pixabay.com/api/?key=';
    const photoAPI = process.env.PIXABAY_KEY;
    const cityQ = "&q=" + encodeURIComponent(totalData[0].city);
    const countryQ =   "&q=" + encodeURIComponent(totalData[0].country);
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
        projectData = photoData;
        totalData.push(projectData);
        console.log(totalData)
        return totalData;        
    } catch (err) {
        console.log("error", err)
    }   
}

