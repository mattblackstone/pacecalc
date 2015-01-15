function initCalc(){

  getEl = function(el) {
    return document.getElementById(el);
  }

  var input_dist = getEl('distance');
  var input_dist_units = getEl('units');
  var input_time_hrs = getEl('hours');
  var input_time_min = getEl('minutes');
  var input_time_sec = getEl('seconds');
  var input_speed = getEl('speed');
  var input_speed_units = getEl('speed_units');
  var input_pace_hrs = getEl('pace_hrs');
  var input_pace_min = getEl('pace_min');
  var input_pace_sec = getEl('pace_sec');
  var input_pace_units = getEl('pace_units');
  var inputs = [input_dist, input_time_hrs, input_time_min, input_time_sec, input_speed, input_pace_hrs, input_pace_min, input_pace_sec];

  var output_time = getEl('time');
  var output_miles = getEl('miles');
  var output_yards = getEl('yards');
  var output_kilometers = getEl('kilometers');
  var output_meters = getEl('meters');
  var output_mph = getEl('miles_per_hour');
  var output_kph = getEl('km_per_hour');
  var output_mpm = getEl('minutes_per_mile');
  var output_mpk = getEl('minutes_per_km');
  var output_mp100yd = getEl('minutes_per_100yd');
  var output_mp100m = getEl('minutes_per_100m');
  var outputs = [output_time, output_miles, output_yards, output_kilometers, output_meters, output_mph, output_kph, output_mpm, output_mpk, output_mp100yd, output_mp100m];

  output_time.data = output_time.innerHTML;
  output_miles.data = output_miles.innerHTML;
  output_yards.data = output_yards.innerHTML;
  output_kilometers.data = output_kilometers.innerHTML;
  output_meters.data = output_meters.innerHTML;
  output_mph.data = output_mph.innerHTML;
  output_kph.data = output_kph.innerHTML;
  output_mpm.data = output_mpm.innerHTML;
  output_mpk.data = output_mpk.innerHTML;
  output_mp100yd.data = output_mp100yd.innerHTML;
  output_mp100m.data = output_mp100m.innerHTML;
  
  var btn_calculate = getEl('btn_calculate');
  var btn_clear = getEl('btn_clear');
  var row_distance = getEl('row_distance');
  var row_time = getEl('row_time');
  var row_speed = getEl('row_speed');
  var row_pace = getEl('row_pace');

  var distance;
  var dist_units;
  var time;
  var pace;
  var pace_units;
  var speed;
  var speed_units;

  var hours;
  var minutes;
  var seconds;
  var miles;
  var yards;
  var kilometers;
  var meters;
  var mph;
  var kph;
  var mpm;
  var mpk;
  var mp100yd;
  var mp100m;
  var m2k = 1.60934;     // miles to kilometers
  var k2m = 0.621371;    // kilometers to miles
  var y2m = 0.000568182; // yards to miles

  btn_calculate.addEventListener('click', output, false);
  btn_clear.addEventListener('click', clearAll, false);

  function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  console.log('Local Storage: '+supports_html5_storage());

  function clearAll(){
    var i = inputs.length;
    while(i--){
      inputs[i].value = "";
    }
    var j = outputs.length;
    while(j--){
      outputs[j].innerHTML = outputs[j].data;
    }
  }

  function output(){
    if(input_dist.value){
      if(input_time_hrs.value || input_time_min.value || input_time_sec.value){
        outputPace();
      }
      else if(input_speed.value || input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
        if (input_speed.value){
          outputTimeBySpeed();
        }
        else if(input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
          outputTimeByPace();
        }
        else{
          alert("Please enter a valid pace or speed");
        }
      }
      else{
        alert("Please enter a valid time, speed or pace");
      }
    }
    else if(input_time_hrs.value || input_time_min.value || input_time_sec.value){
      if(input_speed.value || input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
        if (input_speed.value){
          outputDistanceBySpeed();
        }
        else if(input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
          outputDistanceByPace();
        }
        else{
          alert("Please enter a valid pace or speed");
        }
      }
      else{
        alert("Please enter a valid distance, pace or speed")
      }
    }
    else if(input_speed.value || input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
      if (input_speed.value){
        if(input_dist.value || input_time_hrs.value || input_time_min.value || input_time_sec.value){
          if(input_dist.value){
            outputTimeBySpeed();
          }
          else if(input_time_hrs.value || input_time_min.value || input_time_sec.value){
            outputDistanceBySpeed();
          }
          else{
            alert("Please enter a valid distance or time");
          }
        }
        else{
          alert("Please enter a valid distance or time");
        }
      }
      else if(input_pace_hrs.value || input_pace_min.value || input_pace_sec.value){
        if(input_dist.value || input_time_hrs.value || input_time_min.value || input_time_sec.value){
          if(input_dist.value){
            outputTimeByPace();
          }
          else if(input_time_hrs.value || input_time_min.value || input_time_sec.value){
            outputDistanceByPace();
          }
          else{
            alert("Please enter a valid distance or time");
          }
        }
        else{
          alert("Please enter a valid distance or time");
        }
      }
      else{
        alert("Please enter a valid speed or pace");
      }
    }
    else{
      alert("Please enter only numbers");
      //does not work if dist field contains numbers and time fields contain strings and vice-versa
    }
  }

  function outputTimeBySpeed(){
    distance = parseFloat(input_dist.value);
    if(isNaN(distance) || distance <= 0){
      alert("please enter a valid distance");
    }
    else{
      speed = parseFloat(input_speed.value);
      if(isNaN(speed) || speed <= 0){
        alert("please enter a valid speed");
      }
      else{
        convertSpeed();
        convertDistance();
        time = kilometers / kph;
        convertTime();
        showConversions();
      }
    }
  }

  function outputTimeByPace(){
    distance = parseFloat(input_dist.value);
    if(isNaN(distance) || distance <= 0){
      alert("please enter a valid distance");
    }
    else{
      pace = convertToHours(input_pace_hrs, input_pace_min, input_pace_sec);
      if(pace <= 0){
        alert("please enter a valid pace");
      }
      else{
        convertPaceToSpeed();
        convertDistance();
        time = kilometers / kph;
        convertTime();
        showConversions();
      }
    }
  }

  function outputDistanceBySpeed(){
    time = convertToHours(input_time_hrs, input_time_min, input_time_sec);
    if(time <= 0){
      alert("please enter a valid time")
    }
    else{
      speed = parseFloat(input_speed.value);
      if(isNaN(speed) || speed <= 0){
        alert("please enter a valid speed");
      }
      else{
        convertSpeed();
        convertTime();
        miles = time * mph;
        kilometers = time * kph;
        yards = miles / y2m;
        meters = kilometers * 1000;
        showConversions();
      }
    }
  }

  function outputDistanceByPace(){
    time = convertToHours(input_time_hrs, input_time_min, input_time_sec);
    if(time <= 0){
      alert("please enter a valid time")
    }
    else{
      pace = convertToHours(input_pace_hrs, input_pace_min, input_pace_sec);
      if(pace <= 0){
        alert("please enter a valid pace");
      }
      else{
        convertPaceToSpeed();
        convertTime();
        miles = time * mph;
        kilometers = time * kph;
        yards = miles / y2m;
        meters = kilometers * 1000;
        showConversions();
      }
    }
  }

  function outputPace(){
    //console.log(input_dist.value, input_dist_units.value, input_speed.value, input_speed_units.value, input_pace_hrs.value, input_pace_min.value, input_pace_sec.value, input_pace_units.value, input_time_hrs.value, input_time_min.value, input_time_sec.value);

    distance = parseFloat(input_dist.value);
    if(isNaN(distance) || distance <= 0){
      alert("please enter a valid distance");
    }
    else{
      time = convertToHours(input_time_hrs, input_time_min, input_time_sec);
      if(time <= 0){
        alert("please enter a valid time");
      }
      else{
        convertDistance();
        convertTime();
        showConversions();
        input_time_hrs.value = hours;
        input_time_min.value = Math.floor(minutes);
        input_time_sec.value = roundOff(seconds);
      }
    }
  }

  // -------------------------- HELPERS ---------------------------- //

  function showConversions(){
    mph = miles / time;
    kph = mph * m2k;
    mpm = time / miles * 60; // in minutes (not hours:mins:sec)
    mpk = mpm * k2m;
    mp100m = mpk * 0.1;
    mp100yd = mpm * y2m * 100;

    // time
    var min = Math.round(minutes);
    var sec = roundOff(seconds);
    if(min < 10) min = "0" + min;
    if(sec < 10) sec = "0" + sec;
    output_time.innerHTML = hours + ":" + min + ":" + sec;

    // standard
    output_miles.innerHTML = roundOff(miles) + " " + output_miles.data;
    output_mph.innerHTML = roundOff(mph) + " " + output_mph.data;
    output_mpm.innerHTML = formatPace(mpm) + " " + output_mpm.data; // mins per mile
    output_yards.innerHTML = roundOff(yards) + " " + output_yards.data;
    output_mp100yd.innerHTML = formatPace(mp100yd) + " " + output_mp100yd.data; // mins per 100 yards

    // metric
    output_kilometers.innerHTML = roundOff(kilometers) + " " + output_kilometers.data;
    output_meters.innerHTML = roundOff(meters) + " " + output_meters.data;
    output_kph.innerHTML = roundOff(kph) + " " + output_kph.data;
    output_mpk.innerHTML = formatPace(mpk) + " " + output_mpk.data; // mins per km
    output_mp100m.innerHTML = formatPace(mp100m) + " " + output_mp100m.data; // mins per 100 meters
  }

  function convertSpeed(){
    speed_units = input_speed_units.value;
    if(speed_units == "mph"){
      mph = speed;
      kph = mph * m2k;
    }
    else{
      kph = speed;
      mph = kph * k2m;
    }
  }

  function convertPaceToSpeed(){
    var minpace = pace * 60; // pace in minutes
    pace_units = input_pace_units.value;
    if(pace_units == "mpm"){
      mph = 60 / minpace;
      kph = mph * m2k;
    }
    else if(pace_units == "mpk"){
      kph = 60 / minpace;
      mph = kph * k2m;
    }
    else if(pace_units == "mp100yd"){
      mph = (1 / minpace) * 3.40909091;
      kph = mph * m2k;
    }
    else if(pace_units == "mp100m"){
      kph = (1 / minpace) * 6;
      mph = kph * k2m;
    }
  }

  function convertDistance(){
    dist_units = input_dist_units.value;
    if(dist_units == "mi"){
      miles = distance;
      kilometers = miles * m2k;
      yards = miles / y2m;
      meters = kilometers * 1000;
    }
    else if(dist_units == "km"){
      kilometers = distance;
      miles = kilometers * k2m;
      yards = miles / y2m;
      meters = kilometers * 1000;
    }
    else if(dist_units == "yd"){
      yards = distance;
      miles = yards * y2m;
      kilometers = miles * m2k;
      meters = kilometers * 1000;
    }
    else{
      meters = distance;
      kilometers = meters * 0.001;
      miles = kilometers * k2m;
      yards = miles / y2m;
    }
  }

  function convertTime(){
    hours = Math.floor(time);
    minutes = Math.floor((time * 60) % 60);
    seconds = (time * 3600) % 60;
  }

  function convertToSeconds(input_hrs, input_min, input_sec){
    var hrs = parseFloat(input_hrs.value) * 3600;
    var min = parseFloat(input_min.value) * 60;
    var sec = parseFloat(input_sec.value);
    if(isNaN(hrs)){
      hrs = 0;
      input_hrs.value = 0;
    }
    if(isNaN(min)){
      min = 0;
      input_min.value = 0;
    }
    if(isNaN(sec)){
      sec = 0;
      input_sec.value = 0;
    }
    return hrs + min + sec; // returns time in seconds (3:07:30 = 11250)
  }

  function convertToHours(input_hrs, input_min, input_sec){
    var hrs = parseFloat(input_hrs.value);
    var min = parseFloat(input_min.value) / 60;
    var sec = parseFloat(input_sec.value) / 3600;
    if(isNaN(hrs)){
      hrs = 0;
      input_hrs.value = 0;
    }
    if(isNaN(min)){
      min = 0;
      input_min.value = 0;
    }
    if(isNaN(sec)){
      sec = 0;
      input_sec.value = 0;
    }
    return hrs + min + sec; // returns time in hours (3:07:30 = 3.125)
  }

  function roundOff(num){
    num *= 100;
    num = Math.round(num);
    num /= 100; // for some reason *= .01 sometimes puts ...0000000001 at the end???
    return num;
  }

  function formatPace(min_per_unit){
    var sec = roundOff(min_per_unit * 60);
    var min = Math.floor(sec / 60);
    var hrs = Math.floor(sec / 3600);
    sec = roundOff(sec % 60);
    if(sec < 10) {
      sec = "0" + sec;
    }
    if(hrs < 1){
      return min + ":" + sec;
    }
    else{
      if(min < 10) {
        min = "0" + min;
      }
      return hrs + ":" + min + ":" + sec;
    }
  }
}

window.onload = initCalc;
