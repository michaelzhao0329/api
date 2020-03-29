const express = require('express');
const bodyParser=require("body-parser");
const https=require("https");
const request=require("request");

const app = express();
//const port = process.env.PORT;
const key="2586bbb8f6c285d7841e7a43148b107d";
//var url="https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=2586bbb8f6c285d7841e7a43148b107d";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use("/",  express.static(__dirname + '/public'));
//app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
app.use("/images",  express.static(__dirname + '/public/images'));

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/public/index.html");
});

app.get('/again', function (req, res) {
  res.sendFile(__dirname+"/public/index.html");
});

app.post('/go', function (req, res) {
  console.log(req.body);
  var city = req.body.city;
  var units = req.body.units;

  if ( units === "C" ) {
    inUnits = "metric";
    degreeUnits=" &#8451;"
  } else {
    inUnits = "imperial";
    degreeUnits=" &#8457;"
  }

  var url="https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=" + inUnits + "&APPID=" + key;

  if ( city === "" ) {
    res.sendFile(__dirname+"/public/index.html");
  } else {


  https.get(url,function(response){
    //console.log(response);
if (response.statusCode === 200 ) {
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const weatherDescription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const temp_min = weatherData.main.temp_min;
      const temp_max = weatherData.main.temp_max;
      const img="http://openweathermap.org/img/wn/" + icon + "@2x.png";
      const timezone = weatherData.timezone;

      res.write("<head>");
      res.write("<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>");
      res.write("<link rel='stylesheet' type='text/css' href='/stylesheets/styles.css'>");
      res.write("</head>");
      res.write("<body>");
    	res.write("<div id='weather'>");
      res.write("<p><h3>The weather of " + city + " is currently</h3></p>");
      res.write("<p>" + weatherDescription + "<img src=" + img + " align='middle'>" + "</p>");
      res.write("<p>Temperature is " + temp  + degreeUnits + " </p>");
      res.write("<p>Humidity is " + humidity +"%</p>");
      res.write("<p>Today's lowest Temperature is " + temp_min + degreeUnits + " </p>");
      res.write("<p>Today's highest Temperature is " + temp_max + degreeUnits + " </p>");

      res.write("<form action='/again' method='GET'> ");

      res.write("<button class='btn btn-primary' type='submit' name='submit' >Lookup another City</button> ");
      res.write("</form>");
      res.write("</div>");
      res.write("</body>");
      res.send();
      res.end();
    });
    } else{
          res.sendFile(__dirname+"/public/index.html");
    }
  });
}
});

app.listen(process.env.PORT || 4000, () => console.log(`Example app listening on port "4000"`))
