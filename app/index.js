import clock from "clock";
import document from "document";
import { battery } from "power";
import userActivity from "user-activity";
import * as Utils from '../common/utils';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const stats = ['steps', 'distance', 'calories', 'elevationGain', 'activeZoneMinutes'];

// Fetch handles to UI elements
const stepCount = document.getElementById("stepCount");
const batGauge = document.getElementById("batGauge");
const dateString = document.getElementById("dateString");
const timeNumber = document.getElementById("timeNumber");

const textHandles = [document.getElementById("stepsTxt"), 
                    document.getElementById("distanceTxt"),
                    document.getElementById("caloriesTxt"),
                    document.getElementById("elevationTxt"), 
                    document.getElementById("activeminTxt")];
//const debug = document.getElementById("debug");


// clock colors
let clockColor, clockTime;

// Initialize
init();

// Update the clock every second
clock.granularity = "seconds";

// Update current time every second
clock.ontick = (evt) => {
  clockTime = evt.date;
  render(clockTime);
}

function init() {
  clockTime = null;
}

// Render clock face according to color and time
function render(time) {
  
  for (let i = 0;i<stats.length;i++){
    let currentType = stats[i];
    if  (currentType == 'activeZoneMinutes') {
      // requires a total for activeZoneMinutes or else badness
      let currentDataProg = (userActivity.today.adjusted[currentType].total || 0);
      let currentDataGoal = userActivity.goals[currentType].total;
    } else {
      let currentDataProg = (userActivity.today.adjusted[currentType] || 0);
      let currentDataGoal = userActivity.goals[currentType];
    }
    
    // Get the progress as a percentage, capped at 100
    let goalPercent = currentDataProg/currentDataGoal*100;
    if (goalPercent > 100) {
      goalPercent = 100;
    }

    //textHandles[i].text = Math.round(goalPercent);
    textHandles[i].text = currentDataProg;

    // additionally set the upper text in the top left screen corner
    if (currentType == 'steps') {
      stepCount.text = currentDataProg + ' steps';
    }
    // the x position varies from y=290 to y=-90 as the step goal goes from 0 to 100%
    const balloonHandle = document.getElementById(currentType)
    balloonHandle.y = -3.8*goalPercent + 290;
  }

  dateString.text = days[time.getDay()] + ' '+ time.getDate().toString() + ' '+  months[time.getMonth()];
  timeNumber.text = time.getHours().toString() +':' + Utils.zeroPad(time.getMinutes());

  batGauge.text = Math.floor(battery.chargeLevel) + "%";
  
  //debug.text = currentDataProg + ' of ' + currentDataGoal;
}
