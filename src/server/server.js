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


const geoBaseURL = 'http://api.geonames.org/searchJSON?q='
const geoAPI = process.env.API_KEY
const maxRows = '&maxRows=10&username='
const geomData = {};
const weatherData = {};
app.post("/addGeo", async (req, res) => {
    getGeoInfo(req)
    .then(
        function(data) {
            getWeatherInfo(data)
        }
        
    )
})

const getGeoInfo = async (req) => {
    try {
        console.log(req.body)
        const response =  await axios({
        method: "post",
        url: geoBaseURL + req.body.city + maxRows + geoAPI
        })
        console.log(response);
        const geoData = {
            city: req.body.city,
            date: req.body.date,
            city: response.data.geonames[0].name,
            country: response.data.geonames[0].countryName,
            latitude: response.data.geonames[0].lat,
            longitude: response.data.geonames[0].lng
        }
        console.log("geodata",geoData);
        return geoData;

        
    } catch (err) {
        console.log("error", err)
    }   

}

const getWeatherInfo = async (res) => {
    const weaBaseURL = 'https://api.weatherbit.io/v2.0/normals?key='
    const weaAPI = process.env.WEATHER_KEY
    const day = res.date.slice(0,2);
    const nextDay = "0" + (parseInt(day) + 1).toString()
    const month = res.date.slice(3,5);
    const year = res.date.slice(6,10);
    const changeDateFormat = month + "-" + day;
    const setNextDay = month + "-" + nextDay
    console.log(changeDateFormat);
    const lat = "&lat=" + (Math.round(res.latitude * 100) / 100);
    const lon = "&lon=" + (Math.round(res.longitude* 100) / 100);
    const date = "&start_day=" + changeDateFormat + "&end_day=" + setNextDay + "&units=I"

    try {
        const response =  await axios({
        method: "post",
        url: weaBaseURL + weaAPI + lat + lon + date
        })
        console.log("weatherbit",response);
        const weaData = {
            tempHigh: response.data.data[0].max_temp,
            tempLow: response.data.data[0].min_temp
        }
        console.log("weadata", weaData);
        console.log(res);

        
    } catch (err) {
        console.log("error", err)
    }   
}
