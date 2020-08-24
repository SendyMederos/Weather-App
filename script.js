var uvIndex;
var cityName = localStorage.getItem('lastCity') || "Charlotte";
var cities = JSON.parse(localStorage.getItem("cities")) || [];
// var cities = removeduplicates(cities);

// function removeduplicates(data){
//     return data.filter((value, index) => data.indexOf(value) === index);
// }
// console.log(cities)

function renderCities() {
    $("#cities").empty();
    for (i=0; i< cities.length; i++){   
        $("#cities").append(`<li id="${cities[i]}"class="list-group-item list-group-item-action list-group-item-light"> ${cities[i]} </li>`);
    }
};

function uviChart (){
    if (uvIndex < 3){
        $("#uvi").attr("class", "low")
    }else if  (uvIndex < 6){
        $("#uvi").attr("class", "medium")
    }else if  (uvIndex < 8){
        $("#uvi").attr("class", "high")
    }else if  (uvIndex < 11){
        $("#uvi").attr("class", "very_high")
    }else {
        $("#uvi").attr("class", "extreme")
    }
}

function listOfCities() {
    for (i = 0; i < cities.length; i++) {
        if (cityName == cities[i]) {
            cities.splice(i, 1)
        }
    }
    cities.unshift(cityName)
    cities = cities.slice(0, 8);
    localStorage.setItem("cities", JSON.stringify(cities));
    renderCities();
}


function renderAll() {

    var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=420fa54141903a76b9ac423622e9920d`
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

        
        var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
        $("#currentWeather").append(`<h2>${response.name} <img src = "${iconUrl}"class="icon"> </h2> `)
        $("#currentWeather").append(`<i class="italic">${response.weather[0].description} <i>`)
        $("#currentWeather").append('<h4>' + time + '</h4> <hr>')
        
        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&" + "lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=420fa54141903a76b9ac423622e9920d"

        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            $("#currentWeather").append(`<p>Temperature: ${response.current.temp}°F</p>`)
            $("#currentWeather").append(`<p>Humidity: ${response.current.humidity}%</p>`)
            $("#currentWeather").append(`<p>Wind Speed: ${response.current.wind_speed}MPH</p>`)
            $("#currentWeather").append(`<p>UV Index: <span id="uvi"> ${response.current.uvi} </span></p>`)
            uvIndex = response.current.uvi;
            uviChart();
            $("#5day").html("5-Day Forecast:")
            var fivedays = ["dayOne", "dayTwo", "dayThree", "dayFourth", "dayFive"]
            for (i = 1; i < 6; i++) {
                iconCode = response.daily[i].weather[0].icon;
                iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                $("#five-days").append(`<div id = "${fivedays[i]}" class = "five-days card" > </div>`);
                $(`#${fivedays[i]}`).append(`<h5>${moment(response.daily[i].dt * 1000).format("ddd,  MMMM DD")}</h5>`);
                $(`#${fivedays[i]}`).append(`<img src = "${iconUrl}" class="icon">`);
                $(`#${fivedays[i]}`).append(`<p>Temp: ${response.daily[i].temp.day}°F</p>`);
                $(`#${fivedays[i]}`).append(`<p>Humidity: ${response.daily[i].humidity}%</p>`);
            }
        })
    })
}

$(".start").click(function (event) {
    event.preventDefault();
    $("#currentWeather").empty();
    $("#five-days").empty();
    cityName = $("#input").val().trim()
    console.log(cityName)
    localStorage.setItem('lastCity', cityName);
    renderAll();
    listOfCities();
})


$("ul").click(function(event){
    event.preventDefault();
    event.stopPropagation()
    cityName = event.target.id
    console.log(cityName);
    $("#currentWeather").empty();
    $("#five-days").empty();
    localStorage.setItem('lastCity', cityName);
    renderAll();

})




renderCities();
renderAll();