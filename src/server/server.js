const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require("axios")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))
app.use(cors());

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

//Get geographic data by using API from http://geonames.org
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
        console.log("geographic data",totalData)
        return totalData;      
    } catch (err) {
        console.log("error", err)
    }   
}

//Get weather date by using API from https://api.weatherbit.io
const getWeatherInfo = async () => {
    const weaBaseURL = 'https://api.weatherbit.io/v2.0/normals?key=';
    const weaAPI = process.env.WEATHER_KEY;
    const startDate = totalData[0].startDate.slice(5,10);
    const endDate = totalData[0].endDate.slice(5,10);
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
        return totalData;       
    } catch (err) {
        console.log("error", err)
    }   
}

//Get photo by using API from https://pixabay.com
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
        if (response.data.total === 0) {
            try {
                const res = await axios({
                method: "post",
                url: pixaBayURL + photoAPI + countryQ + otherSetting
                })
                projectData = {photo: res.data.hits[0].webformatURL}
                totalData.push(projectData);
                console.log("total data", totalData)
                return totalData;   
            } catch (err) {
                console.log("error", err)
            } 
        } else {
            projectData = {photo: response.data.hits[0].webformatURL}
            totalData.push(projectData);
            console.log("total data", totalData)
            return totalData;   
        }    
    } catch (err) {
        console.log("error", err)
    }   
}

module.exports = app

