const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "https://api.darksky.net/forecast/6f324bee880a08a8fef6592015d9e641/" +
    encodeURIComponent(latitude) +
    "," +
    encodeURIComponent(longitude) +
    "?units=si";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location!", undefined);
    } else {
      callback(
        undefined,
        `${body.daily.data[0].summary} It is currently ${body.currently.temperature} celsius degrees out. The high today is ${body.daily.data[0].temperatureHigh}°C with a low of ${body.daily.data[0].temperatureLow}°C. There is a ${body.currently.precipProbability}% chance of rain.`
      );
    }
  });
};

module.exports = forecast;
