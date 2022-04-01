var times = ["14:56", "15:05", "00:00", "00:00", "00:00", "15:06", "14:38", "15:11", "15:47", "00:00", "00:00", "00:00", "00:00"];
function fn60sec() {
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
    $('#percent').each(function() {
        $(this).text(out + "%");
    });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=Waanrode&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather } = data;
            const sky = weather[0]['main'];
            $('#weather').text(sky);
            if(sky == 'Clouds') {
                $(this).text("0%");
            }
        })
        .catch((e) => {
        console.log(e)
        });
}
fn60sec();
setInterval(fn60sec, 60*1000);