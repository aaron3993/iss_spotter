const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const { latitude, longitude } = JSON.parse(body).data;
      request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
        if (error) {
          callback(error, null);
          return;
        }
        if (response.statusCode !== 200) {
          const msg = `Status Code ${response.statusCode} when fetching flyover times for coordinates. Response: ${body}`;
          callback(Error(msg), null);
          return;
        }
        callback(null, JSON.parse(body).response);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };