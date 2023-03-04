const express = require('express');
const http =  require('http');
const bodyParser = require('body-parser')
const cors = require('cors');
const xlsx = require('xlsx');
const multer  = require('multer');

var app = express();

const upload = multer({storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, './data');},
    filename: function (req, file, callback) { callback(null, 'weatherData.xlsx');}})
});

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(upload.any());

const server = http.createServer(app);

const retrieveWeatherDataInJSON = () => {
    const file = xlsx.readFile('./data/weatherData.xlsx');

    const sheetNames = file.SheetNames;
    
    return xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
};

app.get("/tableData", function (req, res) {
    const dataJSON = retrieveWeatherDataInJSON();
    res.send(dataJSON);
});

app.post('/uploadFile', function (req, res) {
    res.send(req?.files?.[0]);
});

server.listen(process.env.PORT || 3010, () => { 
    console.log('server started...');
});