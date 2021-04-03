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


const baseURL = 'http://api.geonames.org/searchJSON?q='
const geoAPI = process.env.API_KEY
const maxRows = '&maxRows=10&username='

app.post("/addGeo", async (req, res) => {

    try {
        console.log(req.body)
        const response =  await axios({
        method: "post",
        url: baseURL + req.body.zip + maxRows + geoAPI
        })
        res.send(response.data)
        console.log(req.body.zip);
    } catch (err) {
        console.log("error", err)
    }   
})