var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('./db');

var db = mongojs.connect;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function (req, res) {
  res.send("Sample Code for RESTful API");
})


app.post('/receiveData', (req, res) => {

  var json = req.body;
  var devEUI = json.DevEUI_uplink.DevEUI;
  var payload_hex = json.DevEUI_uplink.payload_hex;
  console.log(json);
  decodeCayennePayload(payload_hex);
  console.log(json.DevEUI_uplink.DevEUI);
  console.log(json.DevEUI_uplink.payload_hex);
  // getTesaTopGunPayloadValue(json.DevEUI_uplink.payload_hex);
  timedate(time);


  //db.node.insert(req.body);
  //res.status(201).json(req.body)
})

function decodeCayennePayload(payload_hex) {
  var start = 0;
  var end = payload_hex.length;

  do {
    var channel = payload_hex.substring(0, 2);
    var dataType = payload_hex.substring(2, 4);
    if (dataType == "00") {
      //Digital Input 1 byte
      var value = payload_hex.substring(4, 6);
      console.log('Digital Input hex: ' + value);
      var dec = hexToInt(value);
      console.log('Digital Input dec: ' + dec);

      start = 6;
    } else if (dataType == "01") {
      // Digital Output
      // 1 byte
      var value = payload_hex.substring(4, 6);
      console.log('Digital Output hex: ' + value);
      var dec = hexToInt(value);
      console.log('Digital Output dec: ' + dec);

      start = 6;
    } else if (dataType == "02") {
      //Analog Input
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4, 8);
      console.log('Analog Input hex : ' + value);
      var dec = hexToInt(value) * 0.01;
      console.log('Analog Input dec : ' + dec);

      start = 8;
    } else if (dataType == "03") {
      //Analog Output
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4, 8);
      console.log('Analog Output hex : ' + value);
      var dec = hexToInt(value) * 0.01;
      console.log('Analog Output dec : ' + dec);

      start = 8;
    } else if (dataType == "65") {
      //Illuminance Sensor
      //2 byte 1 Lux Unsigned MSB
      var value = payload_hex.substring(4, 8);
      console.log('Illuminance Sensor hex : ' + value);
      var dec = hexToInt(value);
      console.log('Illuminance Sensor dec : ' + dec);

      start = 8;
    } else if (dataType == "66") {
      //Presence Sensor 1 byte
      var value = payload_hex.substring(4, 6);
      console.log('Presence Sensor hex : ' + value);
      var dec = hexToInt(value);
      console.log('Presence Sensor dec : ' + dec);

      start = 6;
    } else if (dataType == "67") {
      //Temperature Sensor
      //2 byte 0.1 °C Signed MSB
      var value = payload_hex.substring(4, 8);
      console.log('Temperature Sensor hex : ' + value);
      var dec = hexToInt(value) * 0.1;
      console.log('Temperature Sensor dec : ' + dec);

      start = 8;
    } else if (dataType == "68") {
      //Humidity Sensor
      //1 byte 0.5 % Unsigned
      var value = payload_hex.substring(4, 6);
      console.log('Humidity Sensor hex: ' + value);
      var dec = hexToInt(value) * 0.5;
      console.log('Humidity Sensor dec: ' + dec);

      start = 6;
    } else if (dataType == "71") {
      //Accelerometer
      //6 byte 0.001 G Signed MSB per axis
      var valueX = payload_hex.substring(4, 8);
      var valueY = payload_hex.substring(8, 12);
      var valueZ = payload_hex.substring(12, 16);
      console.log('Accelerometer X hex: ' + valueX);
      console.log('Accelerometer X hex: ' + valueY);
      console.log('Accelerometer X hex: ' + valueZ);


      var decX = hexToInt(valueX) * 0.001;
      var decY = hexToInt(valueY) * 0.001;
      var decZ = hexToInt(valueZ) * 0.001;

      console.log('Accelerometer X dec: ' + decX);
      console.log('Accelerometer X dec: ' + decY);
      console.log('Accelerometer X dec: ' + decZ);

      start = 16;
    } else if (dataType == "73") {
      //Barometer
      //2 byte 0.1 hPa Unsigned MSB
      var value = payload_hex.substring(4, 8);
      console.log('Barometer hex: ' + value);
      var dec = hexToInt(value) * 0.1;
      console.log('Barometer Dec: ' + dec);

      start = 8;
    } else if (dataType == "86") {
      //Gyrometer
      //6 byte 0.01 °/s Signed MSB per axis
      var valueX = payload_hex.substring(4, 8);
      var valueY = payload_hex.substring(8, 12);
      var valueZ = payload_hex.substring(12, 16);
      console.log('Accelerometer X Hex: ' + valueX);
      console.log('Accelerometer Y Hex: ' + valueY);
      console.log('Accelerometer Z Hex: ' + valueZ);

      var decX = hexToInt(valueX) * 0.01;
      var decY = hexToInt(valueY) * 0.01;
      var decZ = hexToInt(valueZ) * 0.01;
      console.log('Accelerometer X Dec: ' + decX);
      console.log('Accelerometer X Dec: ' + decY);
      console.log('Accelerometer X Dec: ' + decZ);

      start = 16;
    } else if (dataType == "88") {
      // GPS Location
      // 9 byte
      // Latitude : 0.0001 ° Signed MSB
      // Longitude : 0.0001 ° Signed MSB
      // Altitude : 0.01 meter Signed MSB
      var valueLatitude = payload_hex.substring(4, 10);
      var valueLongitude = payload_hex.substring(10, 16);
      var valueAltitude = payload_hex.substring(16, 22);
      console.log('GPS Location Latitude hex : ' + valueLatitude);
      console.log('GPS Location Longitude hex: ' + valueLongitude);
      console.log('GPS Location Altitude hex: ' + valueAltitude);

      /*
      var decLatitude  = parseInt(valueLatitude, 16)*0.0001;
      var decLongitude  = parseInt(valueLongitude, 16)*0.0001;
      var decAltitude  = parseInt(valueAltitude, 16)*0.01;
      */
      var decLatitude = hexToInt(valueLatitude) * 0.0001;
      var decLongitude = hexToInt(valueLongitude) * 0.0001;
      var decAltitude = hexToInt(valueAltitude) * 0.01;


      console.log('GPS Location Latitude dec : ' + decLatitude);
      console.log('GPS Location Longitude dec: ' + decLongitude);
      console.log('GPS Location Altitude dec: ' + decAltitude);

      start = 22;

    } else {
      console.log('Error');
    }


    payload_hex = payload_hex.substring(start, end);
    start = 0;
    end = payload_hex.length;

  } while (end > 1);
  console.log('_____');
}

function hexToInt(hex) {
  if (hex.length % 2 != 0) {
    hex = "0" + hex;
  }
  var num = parseInt(hex, 16);
  var maxVal = Math.pow(2, hex.length / 2 * 8);
  if (num > maxVal / 2 - 1) {
    num = num - maxVal
  }
  return num;
}








//Get all user
app.get('/showData', function (req, res) {
  db.Temperature.find(function (err, docs) {
    console.log(docs);
    res.send(docs);
  });

})
/*app.put('/user', function (req, res) {
  console.log('Get from Api', req.body);
  db.Temperature.findAndModify({
    query: {
      id: req.body['id']
    },
    update: {
      $set: req.body
    },
    new: true
  }, function (err, docs) {
    console.log('Update Done', docs);
    res.json(docs);
  });
})*/
app.post('/editData/:id', function (req, res) {

  console.log('Get from Api', req.body);

  var json = req.body;
  var id = req.params.id;
  db.Temperature.findAndModify({
    query: {
      teamID : id
    },
    update: {
      $set: req.body
    },
    new: true
  }, function (err, docs) {
    console.log('Update Done', docs);
    res.json(docs);
  });


})


//Get user by ID
app.get('/findData/:id', function (req, res) {
  var id = req.params.id;

  db.Temperature.findOne({
    teamID : id
  }, function (err, docs) {
    if (docs != null) {
      console.log('found', JSON.stringify(docs));
      res.json(docs);
    } else {
      res.send('User not found');
    }
  });
})

//Update user by ID in body
app.put('/user', function (req, res) {
  console.log('Get from Api', req.body);
  db.Temperature.findAndModify({
    query: {
      id: req.body['id']
    },
    update: {
      $set: req.body
    },
    new: true
  }, function (err, docs) {
    console.log('Update Done', docs);
    res.json(docs);
  });
})

//Add user
app.post('/addData', function (req, res) {
  var json = req.body;
  db.Temperature.insert(json, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });


})

//Delete user by ID
app.delete('/deleteData/:id', function (req, res) {
  var id = req.params.id;
  db.Temperature.remove(
    { teamID : id},
    // "_id": ObjectId(id)
   function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})




var server = app.listen(8080, function () {
  var port = server.address().port

  console.log("Sample Code for RESTful API run at ", port)
})
