// ======
// IMPORT
import clock from "clock";
import document from "document";
import userActivity from "user-activity";

import { preferences } from "user-settings";
import * as fs from "fs";
import { battery } from "power";
import { me as device } from "device";
import { HeartRateSensor } from "heart-rate";

import { display } from "display";

import * as messaging from "messaging";

import * as dateHelper from "../common/helper/date";
import * as formatHelper from "../common/helper/format";


// =======
// GLOBALS
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const hrm;

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";


// ====
// MAIN

// Reload previous settings if any (after app forced close)
onMessageReceived(loadSettings());

display.addEventListener("change", () => {
  if (display.on) {
    if (HeartRateSensor) {
      hrm = new HeartRateSensor();
      hrm.addEventListener("reading", () => {
        const rHR = document.getElementById("rHR");
        rHR.text = hrm.heartRate;
      });
      hrm.start();
    }
   } else {
    if (hrm != undefined) {
      hrm.stop();        
    }
   }
});


// =======================================================
// Update Clock Face values
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
function setTemperature(data) {
  const temperature = document.getElementById("temperature");
  const temperatureFeelsLike = document.getElementById("temperatureFeelsLike");

  temperature.text = Math.round(data.temperature) + "°C";
  temperatureFeelsLike.text = Math.round(data.feels_like) + "°C"
}

// Update display
clock.granularity = "seconds";
clock.ontick = (evt) => {

  setDayTimeDate(evt);
  setBattery();
  setSteps();
  setOutOfSync();
}

display.addEventListener("change", () => {
  if (display.on) {
    fetchWeather();

    onMessageReceived(loadSettings());
  } 
});


// =======================================================
// On settings changed
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
    console.log("Fetching weather");
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  onMessageReceived(evt)
};
function onMessageReceived(evt) {
  if (evt == null)
    return;
  
  console.log(`App received: ${JSON.stringify(evt)}`);

  if (evt.data.key === "accentColor" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting color: ${color}`);

    const temperatureText = document.getElementById("temperature");
    const timeText = document.getElementById("time");
    const batteryBox = document.getElementById("batteryBox");
    temperatureText.style.fill = color;
    timeText.style.fill = color;
    batteryBox.style.fill = color;
    
    saveSettings(evt);
  } 

  else if (evt.data.key === "weather") {
    setTemperature(evt.data);
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


// =======================================================
// Settings from FileSystem
// =======================================================

function loadSettings() {
  try {
    let settings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);

    console.log(`loadSettings: ${JSON.stringify(settings)}`);
    return settings;
    
  } catch (ex) {
    console.log("X> Error loading settings: " + ex);
  }

  return null;
}

function saveSettings(settings) {
  console.log(`saveSettings: ${JSON.stringify(settings)}`);
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}