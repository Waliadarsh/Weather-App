const tiemEl = document.getElementById("time");
const dataEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const day = time.getDay();
  const date = time.getDate();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minute = time.getMinutes();
  const ampm = hour >= 12 ? "pm" : "am";

  tiemEl.innerHTML =
    (hoursIn12HrFormat < 10 ? 'o'+hoursIn12HrFormat : hoursIn12HrFormat) + ":" + (minute< 10? 'o'+minute : minute) + " " + `<span id="am-pm">${ampm}</span>`;

  dataEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

getWeatherData();

function showWeatherData(data) {
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timeZone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat+'N  '  + data.lon+'E'

  currentWeatherItemsEl.innerHTML =`<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}</div>
</div>
<div class="weather-item">
    <div>Presure</div>
    <div>${pressure}</div>
</div>
<div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
</div>
<div class="weather-item">
    <div>sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
</div>`;

    let otherDayForcat = '';
    data.daily.forEach((day,idx)=>{
        if(idx==0){
          // console.log(day)
            currentTempEl.innerHTML=`
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Day - ${day.temp.day}&#176; c</div>
                <div class="temp">Night - ${day.temp.night}&#176; c</div>
            </div>`
        }
        else{
            otherDayForcat+=`<div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day - ${day.temp.day}&#176; c</div>
            <div class="temp">Night - ${day.temp.night}&#176; c</div>
            </div>`
        }
    })

    weatherForecastEl.innerHTML =otherDayForcat
}

