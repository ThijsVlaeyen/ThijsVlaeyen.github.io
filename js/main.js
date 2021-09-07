var cachedLocations = [];
var pos;
updatePosition();

window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

function handleConnection() {
  if (navigator.onLine) {
    return isReachable("").then(function(online) {
      return online;
    });
  } else {
    return false;
  }
}

async function isReachable(url) {
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then(function(resp) {
      return resp && (resp.ok || resp.type === 'opaque');
    })
    .catch(function(err) {
      console.warn('[conn test failure]:', err);
    });
}

function getLocation() {
  var foo = handleConnection();
  if (foo == false) {
    pushLocation()
  } else {
    foo.then(function(online) {
      if(navigator.geolocation) {
        if (online) {
          if (cachedLocations.length > 0) {
            showBatch();
          }
          showPosition();
        } else {
          pushLocation()
        }
      } else {
        console.log("Geo Location not supported by browser");
      }
    });
  }
}

function updatePosition() {
  navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
  });
}

function pushLocation() {
  console.log("locatie naar cache schrijven...");
  var d = new Date();
  cachedLocations.push({
    position: pos, 
    time: d.toLocaleTimeString()});
  console.log({position: pos, time: d.toLocaleTimeString()})
}

function showBatch() {
  let len = cachedLocations.length;
  let notifBody = "Sending batch:\n";
  console.log(cachedLocations);
  for (let i = 0; i < len; i++) {
    let item = cachedLocations.shift();
    notifBody += "- " + item.time + "\nLon: " + item.position.longitude + "Lat: " + item.position.latitude + "\n\n";
  }
  const notifTitle = "Belangrijke batch"
  const options = {
    body: notifBody,
    icon: `favicon.ico`,
    vibrate: [100, 100, 100]
  }
  navigator.serviceWorker.getRegistration().then(function(reg) {
    reg.showNotification(notifTitle, options);
  });
}

function showPosition() {
  const notifTitle = "Belangrijke mededeling"
  var d = new Date();
  const notifBody = "Locatie is gedeeld om " + d.toLocaleTimeString() + "\n\n" + pos.longitude + "\n" + pos.latitude;
  const options = {
    body: notifBody,
    icon: `favicon.ico`,
    vibrate: [100, 100, 100]
  }
  navigator.serviceWorker.getRegistration().then(function(reg) {
    reg.showNotification(notifTitle, options);
  });
  console.log({position: pos, time: d.toLocaleTimeString()})
}

let interval;
function shareLocation() {
  Notification.requestPermission()
  getLocation();
  window.setInterval(updatePosition, 5000)
  window.setInterval(getLocation, 10000);
}

  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
