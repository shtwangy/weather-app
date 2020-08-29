window.addEventListener('load', () => {
    let lng;
    let lat;

    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let degreeSection = document.querySelector('.degree-section');
    const degreeSpan = document.querySelector('.degree-section span');
    const temperatureDegreeMaxMin = document.querySelector('.temperature-degree-max-min');

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lng = position.coords.longitude;
            lat = position.coords.latitude;

            const apiKey = 'b3d7a159888ff6baf5d9a21ea6c13f38';
            const apiBase = 'http://api.openweathermap.org/data/2.5/weather';
            const url = `${apiBase}?lat=${lat}&lon=${lng}&APPID=${apiKey}&units=Imperial`;

            fetch(url)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log(data);
                    const {temp, temp_min, temp_max} = data.main;

                    // Set DOM Elements from the API
                    temperatureDegree.textContent = temp;
                    temperatureDegreeMaxMin.textContent = `${temp_max} / ${temp_min}`;
                    temperatureDescription.textContent = data.weather[0].description;
                    locationTimezone.textContent = `${data.sys.country} / ${data.name}`;

                    // Formula for Celsius
                    let celsius = convertFormulaToCelsius(temp);
                    let celsius_max = convertFormulaToCelsius(temp_max);
                    let celsius_min = convertFormulaToCelsius(temp_min);

                    // Set Icon
                    setIcons(data.weather[0].id, data.sys.sunrise, data.sys.sunset);

                    // Change temperature to Celsius/Fahrenheit
                    degreeSection.addEventListener('click', () => {
                        if(degreeSpan.textContent === 'F') {
                            degreeSpan.textContent = 'C';
                            temperatureDegree.textContent = celsius;
                            temperatureDegreeMaxMin.textContent = `${celsius_max} / ${celsius_min}`;
                        } else {
                            degreeSpan.textContent = 'F';
                            temperatureDegree.textContent = temp;
                            temperatureDegreeMaxMin.textContent = `${temp_max} / ${temp_min}`;
                        }
                    });
                });
        });
    } else {
        h1.textContent = "hey dis is not working because resons";
    }

    function setIcons(weatherId, sunrise, sunset) {
        var unixTime = Math.floor((new Date()).getTime() / 1000);
        const iconClass
            = 'wi wi-owm-'
            + ((sunrise <= unixTime && unixTime <= sunset) ? `day` : `night`)
            + '-'
            + weatherId;
        $("#icon").addClass(`${iconClass}`);
    }

    function convertFormulaToCelsius(formula) {
        return Math.floor((formula - 32) * (5 /9));
    }
});
