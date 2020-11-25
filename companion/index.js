import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { geolocation } from "geolocation";

// =======================================================
// Messaging
// =======================================================

messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weather") {
    queryOpenWeather();
  }
}

messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Send data to device using Messaging API
function sendDataToApp(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log(data);
    messaging.peerSocket.send(data);

  } else {
    console.log("Error: Connection is not open");
  }
}


// =======================================================
// SettingStorage
// =======================================================

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendDataToApp(data);
};


// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendDataToApp(data);
    }
  }
}


// =======================================================
// SettingStorage
// =======================================================

var API_KEY = "";

// Fetch the weather from OpenWeather
function queryOpenWeather() {
  console.log("queryOpenWeather")

  try {
    geolocation.getCurrentPosition(locationSuccess, locationError);
    function locationSuccess(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      console.log("latitude: " + lat);
      console.log("langitude: " + long);
      var linkApi = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="  + long + "&units=metric" + "&APPID=" + API_KEY;

      fetch(linkApi)
      .then(function (response) {
          response.json()
          .then(function(data) {
            var weather = {
              key: "weather", temperature: data["main"]["temp"], humidity: data["main"]["humidity"], location: data["name"]
            }
            sendDataToApp(weather);
          });
      })
      .catch(function (err) {
        console.log("Error fetching weather: " + err);
      });
    };

    function locationError(error) {
      console.log("Error: " + error.code, "Message: " + error.message);
    }
  } catch (error) {
    console.log(error);
  }
}

