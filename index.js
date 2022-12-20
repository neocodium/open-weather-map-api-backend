const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const appId = '4d068848ed6f92575322a5e2c24ae602';
const countryCode = 'US';
const geoUrlBase = 'http://api.openweathermap.org/geo/1.0/zip?zip=';
const openWeatherApi = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

const locations = {
  'henry-hagg': 97119,
  'milo-mciver': 97023,
  'oxbow': 97080
}

async function getLatLong(zipcode) {
  try {
    const response = await fetch(`${geoUrlBase}${zipcode},${countryCode}&appid=${appId}`);
    const data = await response.json()
    return `${data.lat}:${data.lon}`
  } catch (e) {
    console.log(e);
  }
}

async function getWeatherData(zipcode) {
  try {
    const latLongString = await getLatLong(zipcode);
    const latitude = latLongString.split(':')[0];
    const longtitude = latLongString.split(':')[1]

    const weatherResponse = await fetch(`https:/api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=imperial&appid=${appId}`);
    // console.log(await weatherResponse.json())
    return await weatherResponse.json();
  } catch (e) {
    console.log(e);
  } 
}

async function convertToTime(unix) {
  let date = new Date(unix * 1000);
  return `${date.getHours()}:${date.getMinutes()}`;
}

// Get Weather Data
app.get('/getWeatherData/:zipcode', async (req, res) => res.json(await getWeatherData(req.params.zipcode)));
app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))