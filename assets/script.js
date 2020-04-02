// Define global variables

let citySearchInput = "";

// Collect city input and call API

function citySearch() {
    citySearchInput = $("#citySearchInput").val().trim();
    citySearchInput = citySearchInput.split(" ").join("+");
    displayWeather();
}

$("#citySearchBtn").click(function() {
    event.preventDefault();
    citySearch();
});

$('#citySearchInput').keypress(function (event) {                                       
    if (event.which == 13) {
         event.preventDefault();
         $(this).blur();
         citySearch();   
    };
});

$(".searchHistoryBtn").click(function () {
    event.preventDefault();
    citySearchInput = $(this).text();
    citySearchInput = citySearchInput.split(" ").join("+");
    displayWeather();
})

// OpenWeatherMap API function

function tempCalc(tempK) {
    return Math.round((tempK - 273.15) * 9/5 + 32)
}

function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearchInput + "&appid=4679460f119c185a5abb3222455a221f";

    $.ajax ({               // Get weather for current day
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {

        $("#cityName").text(response.name + ` (${moment().format("l")})`);
        $("#currentTemp").text(tempCalc(response.main.temp) + " °F");
        $("#currentHumidity").text(response.main.humidity + "%");
        $("#currentWindSpeed").text(response.wind.speed + " MPH");
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=4679460f119c185a5abb3222455a221f&lat=" + lat + "&lon=" + lon;

        $.ajax ({               // Get UV index for current day
            url: uvURL,
            method: "GET"
        })
        .then(function(response) {
            $("#currentUV").text(response.value);
            
            if (response.value > 8.0) {
                $("#currentUV").removeClass().addClass("badge badge-danger");
            }
            if (6.0 <= response.value < 8.0) {
                $("#currentUV").removeClass().addClass("badge badge-warning");
            }
            if (3.0 <= response.value < 6.0) {
                $("#currentUV").removeClass().addClass("badge badge-warning");
            }
            if (response.value < 3.0) {
                $("#currentUV").removeClass().addClass("badge badge-success");
            };
        });
    });

    fiveDayForecast();

}; 

function fiveDayForecast() {

    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearchInput + "&appid=4679460f119c185a5abb3222455a221f";

    $.ajax({
        url: forecastURL,
        method: "GET"
    })
    .then(function(response) {
        console.log("5 day");
        console.log(response.list);
    })

    $("#currentDatePlus1").text(moment().add(1, "d").format("l"));
    $("#currentDatePlus2").text(moment().add(2, "d").format("l"));
    $("#currentDatePlus3").text(moment().add(3, "d").format("l"));
    $("#currentDatePlus4").text(moment().add(4, "d").format("l"));
    $("#currentDatePlus5").text(moment().add(5, "d").format("l"));

}