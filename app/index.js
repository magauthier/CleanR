import clock from "clock";
import document from "document";
import userActivity from "user-activity";

import { preferences } from "user-settings";
import { battery } from "power";
import { me as device } from "device";

import * as messaging from "messaging";

import * as dateHelper from "../common/helper/date";
import * as formatHelper from "../common/helper/format";


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var LastWeatherFetch = "None";


// =======================================================
// Update Clock Face
// =======================================================

function setDayTimeDate(evt){
  const dayText = document.getElementById("day");
  const timeText = document.getElementById("time");
  const dateText = document.getElementById("date");

  let today = evt.date;
  let hours = today.getHours();
  let minutes = formatHelper.zeroPad(today.getMinutes());

  if (preferences.clockDisplay === "12h") {
    hours = hours % 12 || 12;
  } 
  else {
    // 24h format
    hours = formatHelper.zeroPad(hours);
  }
  
  dayText.text = days[today.getDay()];
  timeText.text = `${hours}:${minutes}`;
  dateText.text = months[today.getMonth()] + " " + formatHelper.zeroPad(today.getDate());
}
function setBattery(){
  const batteryBox = document.getElementById("batteryBox");
  
  let BatteryLevelPixel = Math.floor(battery.chargeLevel * 3.36);
  
  batteryBox.x = (336 / 2) - ((BatteryLevelPixel) / 2);
  batteryBox.width = (BatteryLevelPixel);
}
function setSteps(){
  const stepsText = document.getElementById("steps");
  
  let Steps = (userActivity.today.adjusted["steps"] || 0);

  stepsText.text = Steps;  
}
function setOutOfSync(){
  const OutOfSyncIcon = document.getElementById("outOfSync");
  OutOfSyncIcon.style.visibility = "hidden";

  if (typeof device.lastSyncTime === 'undefined') {
    OutOfSyncIcon.style.visibility = "visible";
    return;
  }
    
  let hours = Math.abs(Date.now() - device.lastSyncTime) / 36e5;
  if (hours > 1)
    OutOfSyncIcon.style.visibility = "visible"
}

// Update display
clock.granularity = "seconds";
clock.ontick = (evt) => {

  setDayTimeDate(evt);
  setBattery();
  setSteps();
  setOutOfSync();
  
  fetchWeather();  
}


// =======================================================
// OnChanged
// =======================================================

function onSettingChanged(evt) {
  console.log(`key: ${evt.key}`)
  console.log(`old value: ${evt.oldValue}`)
  console.log(`new value: ${evt.newValue}`)

  accentColor = evt.newValue;
}

// =======================================================
// Messaging
// =======================================================

function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {

    if (LastWeatherFetch === 'None') { // || (Math.abs(Date.now() - LastWeatherFetch) / 36e5) > 1 ) {
      console.log("Fetching weather");
      LastWeatherFetch = Date.now();

      messaging.peerSocket.send({
        command: 'weather'
      });
    }

  }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);

  if (evt.data.key === "accentColor" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting color: ${color}`);

    const timeText = document.getElementById("time");
    const batteryBox = document.getElementById("batteryBox");
    timeText.style.fill = color;
    batteryBox.style.fill = color;
  } 

  else if (evt.data.key === "weather") {
    console.log(evt.data.temperature)

    const temperature = document.getElementById("temperature");
    temperature.text = Math.round(evt.data.temperature) + "°C";
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
  fetchWeather();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  console.log("Connection error: " + err.code + " - " + err.message);
}
