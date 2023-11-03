var times = ["14:56", "15:05", "00:00", "00:00", "00:00", "15:06", "14:38", "15:11", "15:47", "00:00", "00:00", "00:00", "00:00", "00:00", "00:00", "00:00", "16:13", "16:29", "15:41", "15:50", "15:21", "14:02", "14:14", "16:10", "13:11", "13:31"];
function fn60sec() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Waanrode&appid=4d8fb5b93d4af21d66a2948710284366&units=metric&lang=nl`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather, clouds } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                weather[0]["icon"]
              }.svg`;
            const markup = `
              <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
              </h2>
              <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
              <figure>
                <img class="city-icon" src="${icon}" alt="${
              weather[0]["description"]
            }">
                <figcaption>${weather[0]["description"]}</figcaption>
              </figure>
            `;

            $('#weather').html(markup);
            if(clouds['all'] > 95) {
                $('#percent').text("0.1%");
            } else {
                var tottime = times.length;
                var totsmall = 0;
                for (var i = 0; i < tottime; i++) {
                    var time = times[i].split(":");
                    var hours = parseInt(time[0]);
                    var minutes = parseInt(time[1]);
                    var totmin = hours * 60 + minutes;
                    
                    var current = new Date();
                    var chkhours = current.getHours();
                    var chkminutes = current.getMinutes();
                    var chktotmin = chkhours * 60 + chkminutes;
            
                    if(totmin < chktotmin) {
                        totsmall++;
                    }
                }
                var round = totsmall/tottime*100
                var out = 100 - Math.round(round);
                $('#percent').text(out + "%");
            }
        })
        .catch((e) => {
        console.log(e)
        });
}
fn60sec();
setInterval(fn60sec, 60*1000);
