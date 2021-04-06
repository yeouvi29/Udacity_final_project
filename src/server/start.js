const app = require('./server.js')
 
const port = 8081;
 
app.listen(port, function() {
        console.log("server running")
        console.log(`running on local host: ${port}`);
    });
