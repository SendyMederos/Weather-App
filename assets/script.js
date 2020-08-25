///setting my global variables
var uvIndex;
/// cityName will initialize with the last city searched or the default Charlotte
var cityName = localStorage.getItem('lastCity') || "Charlotte";
///cities is an array that holds the last cities searched or an empty array
var cities = JSON.parse(localStorage.getItem("cities")) || [];

//emptying rendering  the list of cities
function renderCities() {
    $("#cities").empty();
    for (i=0; i< cities.length; i++){   
        $("#cities").append(`<li id="${cities[i]}"class="list-group-item list-group-item-action list-group-item-light"> ${cities[i]} </li>`);
    }
};
// this function will determine what class will the UV Index will have to determine its bg-color in css
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
// I am including a new city in the array of cities that will render in as a list
function listOfCities() {
    //first making  sure that the new city(cityName) is not in the list, if it is, 
    //then will delete it from that possition, so when is render, it will appear on top of the list
    for (i = 0; i < cities.length; i++) {
        if (cityName == cities[i]) {
            cities.splice(i, 1)
        }
    }
    //adding it to the beginning of the array so it renders last to first city searched
    cities.unshift(cityName)
    //only 8 cities will be permited in the array(in the list)
    cities = cities.slice(0, 8);
    //passing as a string the new array
    localStorage.setItem("cities", JSON.stringify(cities));
    //call render cities to create the list
    renderCities();
}

// main function where the APIs calls are being made /// made it a function so it ca  be callled multiple times
function renderAll() {
    //this url takes the city name and the api key as parameters// the city will be variable cityName 
    // I am calling this api to access longitud and lattitud based on the city name
    var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=420fa54141903a76b9ac423622e9920d`
    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        //using moment js so we can render the desired format
        var time = moment(response.dt * 1000).format("MMMM, DD YYYY");
        console.log(time);
        var lat = response.coord.lat
        var lon = response.coord.lon
        var iconCode = response.weather[0].icon;

        
        var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
        $("#currentWeather").append(`<h2>${response.name} <img src = "${iconUrl}"class="icon"> </h2> `)
        $("#currentWeather").append(`<i class="italic">${response.weather[0].description} <i>`)
        $("#currentWeather").append('<h4>' + time + '</h4> <hr>')
        /// once we got the lon and lat we can access to the api we will use to render mostly everything 
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
///this function everytime you search for a city it grab the input and with the cityName call the APIs again
/// and render everything including the new list of cities
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

/// if clicked on the list items it will render the data for that city 
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

///automatically calling this functions so it renders the last city searched and/or the list of cities
renderCities();
renderAll();