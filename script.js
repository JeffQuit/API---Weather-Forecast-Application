//* Array Area.
//Cities Array is local storage array or if local is blank, it pulls from a blank array using the OR logic operator ||
var citiesArray = JSON.parse(localStorage.getItem('citiesArrayLS')) || [];
var cityNameSearch = citiesArray[citiesArray.length - 1];

function renderTable() {
	$('.cityView').empty();

	// Looping through the array of cities to make DOMS for Table
	for (var i = 0; i < citiesArray.length; i++) {
		var tr = $('<tr>');
		var td = $('<td>');

		td.attr('data-cityName', citiesArray[i]);
		td.attr('data-cityList', 'listed');
		td.addClass('clickCityDisplay');
		td.text(citiesArray[i]);

		$('.cityView').append(tr);
		$(tr).append(td);
	}
	//Click function that is tied to the clickCityDisplay class which is on each table TD as well as the search button
	$('.clickCityDisplay').click(function ShowCity() {
		// If the city is already on the list, then use the data attribute with the city name to pull up the Weather
		if ($(this).attr('data-cityList') === 'listed') {
			var cityNameSearch = $(this).attr('data-cityName');
		}
		// Else, use the previous HTML value of the search button, which is the input text area as the city name to search in the API
		else if ($(this).prev().val() !== null) {
			var cityNameSearch = $(this).prev().val();
		}

		//* Weather API
		var APIKey = 'c9b7f27d76416e965f1c57bbb1af7f0b';

		// Here we are building the URL we need to query the database
		var queryURL = 'https://api.openweathermap.org/data/2.5/weather?' + 'q=' + cityNameSearch + '&appid=' + APIKey;

		//* API Call to get standard information on City
		$.ajax({
			url: queryURL,
			method: 'GET',
		})
			// We store all of the retrieved data inside of an object called "response"
			.then(function (response) {
				// Kelven to Fahrenheit
				var tempFahrenheit = (response.main.temp - 273.15) * 1.8 + 32;
				var tempFahrenheitRound = Math.round(tempFahrenheit);
				// Icon Image URL
				var todayIcon = 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';

				//Set DOMS for current Day Weather except UV Index which requires seperate API
				$('.currentDayForecastHeader').html(response.name + ', ' + moment().format('dddd, MMMM Do YYYY') + '    ' + '<img id="todayWeatherIcon" src=' + todayIcon + '></img>');
				$(todayWeatherIcon).attr('height', '50%');

				$('.currentDayTemp').html('<b>Tempreture:</b> ' + tempFahrenheitRound + '\xB0');
				$('.currentDayHumid').html('<b>Humidity:</b> ' + response.main.humidity + '&#37;');
				$('.currentDayWindSpeed').html('<b>Wind Speed:</b> ' + response.wind.speed + 'MPH');

				//! Second and Third API Calls for UV Index and 5 day forecast
				var latitude = response.coord.lat; //* Sets latitude as variable for second and third API calls
				var longitude = response.coord.lon; //* Sets longitude as variable for second and third API calls

				//* AJAX URL Variable for UV Index
				var queryURLUV = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + latitude + '&lon=' + longitude;

				//* AJAX to call new API for UV Index using Long & Lat
				$.ajax({
					url: queryURLUV,
					method: 'GET',
				}).then(function (uvIndex) {
					$('.currentDayUV').html('<b>UV Index:</b> ' + '<div class="uvIndexBox " >' + uvIndex.value + '</div>');

					//* If Else Statement below sets background color for uvIndexBox Div depending on the UV Index Value
					if (uvIndex.value < 3) {
						$('.uvIndexBox').css('background-color', 'green');
					} else if (uvIndex.value >= 3 && uvIndex.value <= 5) {
						$('.uvIndexBox').css('background-color', 'yellow');
					} else if (uvIndex.value > 5 && uvIndex.value <= 7) {
						$('.uvIndexBox').css('background-color', 'orange');
					} else if (uvIndex.value > 7 && uvIndex.value < 11) {
						$('.uvIndexBox').css('background-color', 'red');
					} else if (uvIndex.value >= 11) {
						$('.uvIndexBox').css('background-color', 'violet');
					}
				});

				//* AJAX URL Variable for 5 day Forecast
				var queryURLFiveDay = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + APIKey + '&lat=' + latitude + '&lon=' + longitude;

				//* AJAX  to call new API for 5 day forecast
				$.ajax({
					url: queryURLFiveDay,
					method: 'GET',
				}).then(function (fiveDayForecast) {
					console.log(fiveDayForecast);

					//* Function to convert YYYY-MM-DD to MM-DD-YYYY (snipped from Stackoverflow)
					function dateReFormat(input) {
						var datePart = input.match(/\d+/g),
							year = datePart[0];
						(month = datePart[1]), (day = datePart[2]);

						return day + '/' + month + '/' + year;
					}

					//* DOMS for 5 day forecast
					//* Day 1

					$('.fDay1Date').html(dateReFormat(fiveDayForecast.list[0].dt_txt));
					var day1Icon = 'http://openweathermap.org/img/wn/' + fiveDayForecast.list[0].weather[0].icon + '.png';
					$('.fDay1Icon').html('<img src=' + day1Icon + '></img>');
					var tempFahrenheit0 = (fiveDayForecast.list[0].main.temp - 273.15) * 1.8 + 32;
					var tempFahrenheitRound0 = Math.round(tempFahrenheit0);
					$('.fDay1Temp').html('<b>Temp:</b> ' + tempFahrenheitRound0 + '\xB0');
					$('.fDay1Humid').html('<b>Humidity:</b> ' + fiveDayForecast.list[0].main.humidity + '&#37;');

					//* Day 2

					$('.fDay2Date').html(dateReFormat(fiveDayForecast.list[1].dt_txt));
					var day2Icon = 'http://openweathermap.org/img/wn/' + fiveDayForecast.list[1].weather[0].icon + '.png';
					$('.fDay2Icon').html('<img src=' + day2Icon + '></img>');
					var tempFahrenheit1 = (fiveDayForecast.list[1].main.temp - 273.15) * 1.8 + 32;
					var tempFahrenheitRound1 = Math.round(tempFahrenheit1);
					$('.fDay2Temp').html('<b>Temp:</b> ' + tempFahrenheitRound1 + '\xB0');
					$('.fDay2Humid').html('<b>Humidity:</b> ' + fiveDayForecast.list[1].main.humidity + '&#37;');

					//* Day 3

					$('.fDay3Date').html(dateReFormat(fiveDayForecast.list[2].dt_txt));
					var day3Icon = 'http://openweathermap.org/img/wn/' + fiveDayForecast.list[2].weather[0].icon + '.png';
					$('.fDay3Icon').html('<img src=' + day3Icon + '></img>');
					var tempFahrenheit2 = (fiveDayForecast.list[2].main.temp - 273.15) * 1.8 + 32;
					var tempFahrenheitRound2 = Math.round(tempFahrenheit2);
					$('.fDay3Temp').html('<b>Temp:</b> ' + tempFahrenheitRound2 + '\xB0');
					$('.fDay3Humid').html('<b>Humidity:</b> ' + fiveDayForecast.list[2].main.humidity + '&#37;');

					//* Day 4

					$('.fDay4Date').html(dateReFormat(fiveDayForecast.list[3].dt_txt));
					var day4Icon = 'http://openweathermap.org/img/wn/' + fiveDayForecast.list[3].weather[0].icon + '.png';
					$('.fDay4Icon').html('<img src=' + day4Icon + '></img>');
					var tempFahrenheit3 = (fiveDayForecast.list[3].main.temp - 273.15) * 1.8 + 32;
					var tempFahrenheitRound3 = Math.round(tempFahrenheit3);
					$('.fDay4Temp').html('<b>Temp:</b> ' + tempFahrenheitRound3 + '\xB0');
					$('.fDay4Humid').html('<b>Humidity:</b> ' + fiveDayForecast.list[3].main.humidity + '&#37;');

					//* Day 5

					$('.fDay5Date').html(dateReFormat(fiveDayForecast.list[4].dt_txt));
					var day5Icon = 'http://openweathermap.org/img/wn/' + fiveDayForecast.list[4].weather[0].icon + '.png';
					$('.fDay5Icon').html('<img src=' + day5Icon + '></img>');
					var tempFahrenheit4 = (fiveDayForecast.list[4].main.temp - 273.15) * 1.8 + 32;
					var tempFahrenheitRound4 = Math.round(tempFahrenheit4);
					$('.fDay5Temp').html('<b>Temp:</b> ' + tempFahrenheitRound4 + '\xB0');
					$('.fDay5Humid').html('<b>Humidity:</b> ' + fiveDayForecast.list[4].main.humidity + '&#37;');
				});
			});
	});
}

// Function to add new city to cities array when city is submitted in the text input and submitted. Also stores to local which is retreived later
$('#add-city').on('click', function (event) {
	event.preventDefault();

	var city = $('#city-input').val().trim();

	citiesArray.push(city);
	localStorage.setItem('citiesArrayLS', JSON.stringify(citiesArray));

	renderTable();
});

renderTable();
