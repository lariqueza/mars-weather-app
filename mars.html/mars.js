var API_KEY = 'DEMO KEY';
var API_URL = 'https://api.nasa.gov/planetary/apod?api_key=${API_KEY}wNbST1SwHsSGuNXoouNQV2Qm23DObShIZVyaXSua';

var previousWeatherToggle = document.querySelector('.show-previous-weather');
var previousWeather = document.querySelector('.previous-weather');
var currentSolElement = document.querySelector('[data-current-sol]');
var currentDateElement = document.querySelector('[data-current-date]');
var currentTempHighElement = document.querySelector('[data-current-temp-high]');
var currentTempLowElement = document.querySelector('[data-current-temp-low]');
var WindSpeedElement = document.querySelector('[data-wind-speed]');
var windDirectionText = document.querySelector('[data-wind-direction-text');
var windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');
var previousSolTemplate = document.querySelector('[data-previous-sol-template]');
var previousSolContainer = document.querySelector('[data-previous-sols]');
var unitToggle = document.querySelector('[data-unit-toggle]');
var previousWeatherToggle = document.querySelector('.show-previous-weather');
var previousWeather = document.querySelector('.previous-weather');
var metricRadio = document.getElementById('cel');
var imperialRadio = document.getElementById('fah');





previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classlist.toggle('show-weather')
})

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnits()

    unitToggle.addEventListener('click', () => {
      let metricUnits = !metricRadio.checked
      metricRadio.checked = metricUnits
      imperialRadio.checked = !metricUnits
      displaySelectedSol(sols)
      displayPreviousSols(sols)
      updateUnits()
    })

    metricRadio.addEventListener('change', () => {
        displaySelectedSol(sols)
        displayPreviousSols(sols)
        updateUnits()
    })

    imperialRadio.addEventListener('change', () => {
        displaySelectedSol(sols)
        displayPreviousSols(sols)
        updateUnits()
    })
})

function displaySelectedSol(sols) {
    var selctedSol = sols[selectedSolIndex]
    currentSolElement.innerText = selectedSol.sol
    currentDateElement.innerText = displayDate(selectedSol.date)
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp)
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp)
    windSpeedElement.innerText = selectedSol.windSpeed
    windDirectionArrow.style.setProperty('--direction', '${selectedSol.windDirectionDegrees}deg')
    windDirectionText.innerText = selectedSol.windDirectionCardinal
}

function displayPreviousSols(sols) {
    previousSolcontainer.innerHTML = ''
    sols.forEach((solData, index) => {
        var solContainer = previousSolTemplate.content.cloneNode(true)
        solContainer.querySelector('[data-sol]').innerText = solData.sol
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date)
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp)
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp)
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = index 
            displaySelectedSol(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
}

function displayDate(date) {
    return date.toLocaleDateString(
        undefined,
        {day: 'numeric', month: 'long'}
    )
}

function displayTemperature(temperature) {
    var returnTemp = temperature
    if(!isMetric()) {
      returnTemp = (temperature - 32) * (5 / 9)
    }
    return Math.round(temperature)
}

function displaySpeed(speed) {
    var returnSpeed = speed
    if(!isMetric()) {
        returnSpeed = speed / 1.609
    }
    return Math.round(speed)
}

function getWeather () {
    return fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        var {
          sol_keys,
          validity_checks,
          ...solData
        } = data
        return Object.entries(solData).map(([sol, data]) => {
          return {
              sol: sol,
              maxTemp: data.AT.mx,
              minTemp: data.AT.mn,
              windspeed: data.HWS.av,
              windDirectionDegrees:
              data.WD.most_common.compass_degrees,
              windDirectionCardinal: data.WD.most_common.compass_point,
              date: new Date(data.First_UTC)
          }
        })
    });
}

function updateUnits() {
    var speedUnits = document.querySelector('[data-speed-unit]')
    var tempUnits = document.querySelector('[data-temp-unit]')
    speedUnits.forEach(unit => {
        unit.innerText = ismetric() ? 'kph' : 'mph'
    })
    tempUnits.forEach (unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })
}

function isMetric() {
    return metricRadio.checked
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("weather app has started");  
});