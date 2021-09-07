window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geo Location not supported by browser");
  }
}
//function that retrieves the position
function showPosition(position) {
  var location = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude
  }
  const notifTitle = "Belangrijke mededeling"
  var d = new Date();
  const notifBody = "Locatie is gedeeld om " + d.toLocaleTimeString() + "\n\n" + location.longitude + "\n" + location.latitude;
  const options = {
    body: notifBody,
    icon: `favicon.ico`,
    vibrate: [100]
  }
  navigator.serviceWorker.getRegistration().then(function(reg) {
    reg.showNotification(notifTitle, options);
  });
  console.log(location)
}

let interval;
function shareLocation() {
  Notification.requestPermission()
  interval = window.setInterval(getLocation, 5000, 15);
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
