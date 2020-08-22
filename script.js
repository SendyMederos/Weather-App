var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=charlotte&appid=420fa54141903a76b9ac423622e9920d"
$.ajax({
    url: currentURL,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var time = moment(response.dt*1000).format("MMMM  DD YYYY");
    console.log(time);
    var lat = response.coord.lat
    var lon = response.coord.lon
    var iconCode = response.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    $("#weather").append('<div id="currentWeather"></div>')
    $("#currentWeather").append(`<h2>${response.name}</h2>`)
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&"+ "lon=" +lon+"&units=metric&exclude=minutely,hourly&appid=420fa54141903a76b9ac423622e9920d"
    
    $.ajax({
      url: oneCallURL,
      method: "GET"
    }).then(function(response) {
      console.log(response)   
    $("#currentWeather").append(`<p>` + time + `</p>`)
    $("#currentWeather").append(`<img src = "${iconUrl}">`)
    $("#currentWeather").append(`<p>${response.current.uvi}</p>`)
    var fivedays = ["dayOne", "dayTwo", "dayThree", "dayFourth", "dayFive"]
    for (i = 0; i < 5; i++) {
        $("#currentWeather").append(`<div class = "${fivedays[i]} " id = "fivedays"> </div>`)
         $("#fivedays").append(`<h5>${moment(response.daily[i].dt*1000).format("dddd,  MMMM DD")}</h5>`)
         $("#fivedays").append(`<p>${response.daily[i].temp.day}</p>`)
         $("#fivedays").append(`<p>${response.daily[i].humidity}%</p>`)
    }
})
  })