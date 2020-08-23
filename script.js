var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=charlotte&units=imperial&appid=420fa54141903a76b9ac423622e9920d"
$.ajax({
    url: currentURL,
    method: "GET"
}).then(function (response) {
    console.log(response)
    var time = moment(response.dt * 1000).format("MMMM, DD YYYY");
    console.log(time);
    var lat = response.coord.lat
    var lon = response.coord.lon
    var iconCode = response.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    $("#currentWeather").append(`<h2>${response.name}</h2>`)
    
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&" + "lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=420fa54141903a76b9ac423622e9920d"

    $.ajax({
        url: oneCallURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $("#currentWeather").append('<h3>' + time + '</h3>')
        $("#currentWeather").append(`<p>${response.current.temp}</p>`)
        $("#currentWeather").append(`<img src = "${iconUrl}">`)
        $("#currentWeather").append(`<p>${response.current.uvi}</p>`)

        var fivedays = ["dayOne", "dayTwo", "dayThree", "dayFourth", "dayFive"]
        for (i = 1; i < 6; i++) {
            iconCode = response.daily[i].weather[0].icon;
            iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $("#five-days").append(`<div id = "${fivedays[i]}" class = "five-days card" > </div>`);
            $(`#${fivedays[i]}`).append(`<h5>${moment(response.daily[i].dt * 1000).format("dddd,  MMMM DD")}</h5>`);
            $(`#${fivedays[i]}`).append(`<img src = "${iconUrl}" class="text-center">`);
            $(`#${fivedays[i]}`).append(`<p>Temp: ${response.daily[i].temp.day}°F</p>`);
            $(`#${fivedays[i]}`).append(`<p>Humidity: ${response.daily[i].humidity}%</p>`);
        }
    })
})