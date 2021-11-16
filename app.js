const express = require("express");
const request = require('request');
const bodyParser = require('body-parser');
let app = express();
let apiKey = "823d0bf90ed144ab9bd123755211511";


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', function (req, res) {
    res.render('index');
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/cityRequest', function (req, res) {
    let value = req.body.city;
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&units=imperial&q=${value}&aqi=no`;

    request(url, function (err, r, body) {

        if (err) {
            res.send({
                weather: null,
                error: weather.error.message
            });
        } else {
            let weather = JSON.parse(body);

            if (weather.location == undefined) {
                res.send({
                    status: '504',
                    error: weather.error.message
                });
            } else {
                res.send(weather);
            }
        }
    });
});


const port = process.env.PORT || 500;

app.listen(port, function () {
    console.log(`listening on port ${port}!`);
})