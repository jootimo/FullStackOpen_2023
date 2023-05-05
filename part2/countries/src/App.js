import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const countriesBasePath = 'https://restcountries.com/v3.1/'
const allCountriesPath = 'all'
const countriesRequiredInfo = '' //filtering doesn't seem to work due to some CORS error: '?fields=name,capital,area,languages,flags`'

const weatherBasePath = "https://api.open-meteo.com/v1/forecast"

const getWeatherCodeDescription = (weatherCode) => {
  switch (weatherCode) {
    case 0:
      return 'Clear sky'
    case 1: case 2: case 3:
      return 'Mainly clear, partly cloudy, and overcast'
    case 45: case 48:
      return 'Fog and depositing rime fog'
    case 51: case 53: case 55:
      return 'Drizzle: Light, moderate, and dense intensity'
    case 56: case 57:
      return 'Freezing Drizzle: Light and dense intensity'
    case 61: case 63: case 65:
      return 'Rain: Slight, moderate and heavy intensity'
    case 66: case 67:
      return 'Freezing Rain: Light and heavy intensity'
    case 71: case 73: case 75:
      return 'Snow fall: Slight, moderate, and heavy intensity'
    case 77:
      return 'Snow grains'
    case 80: case 81: case 82:
      return 'Rain showers: Slight, moderate, and violent'
    case 85: case 86: 
      return 'Snow showers slight and heavy'
    case 95:
      return 'Thunderstorm: Slight or moderate'
    case 96: case 99:
      return 'Thunderstorm with slight and heavy hail'
    default:
      return '';
  }
}

const WeatherInfo = ({cityname, weatherData}) => {
  if(cityname === null || cityname.length === 0 || weatherData === null) {
    return (
      <div> No weather data available </div>
    )
  }

  return (
    <div>
      <h2> Weather in {cityname} </h2>
      <p> {getWeatherCodeDescription(weatherData.current_weather.weathercode)} </p>
      <ul>
        <li> temperature: {weatherData.current_weather.temperature} °C </li>
        <li> wind: {weatherData.current_weather.winddirection}°, {weatherData.current_weather.windspeed} m/s </li>
      </ul>
    </div>
  )
}

const NoCountryToShow = ({msg}) => { return (
  <div> {msg} </div>
  ) 
}

const CountryNameList = ({countries, onShowCountryInfoButtonClick}) => {
  console.log('showing a list of countries: ', countries)

  return  (
    <div>
        <ul>
          {countries.map((c) => 
          <li key={c.name.common}>
             {c.name.common} 
             <button onClick={() => onShowCountryInfoButtonClick(c)}> show </button>
          </li>)}
        </ul>
    </div>
  )
}

const CountryDetailInfo = ({country}) => {
  const [weatherData, setWeatherData] = useState(null)
  const [lat, lon] = country.capitalInfo.latlng

  axios
    .get(weatherBasePath.concat(`?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`))
    .then(response => {
      console.log('got weather reponse: ', response.data)
      setWeatherData(response.data)
    })

  console.log('showing detail info of ', country)
  
  // Languages are stored as objects, e.g. { fin: 'Finnish', swe: 'Swedish' }
  var languages = []
  Object.keys(country.languages).forEach((key, index) => {
    languages.push(country.languages[key])
  })

  return (
  <div>
    <h2> {country.name.common} </h2>
    <div>
      capital: {country.capital[0]}
    </div>
    <div>
      area: {country.area} km²
    </div>
    <div>
      languages:
      <ul>
      {languages.map((l) => <li key={l}>{l}</li>)}    
      </ul>
    </div>
    <div>
      <img src={country.flags.png} alt={country.flag.alt}></img>
    </div>
    <div>
      <WeatherInfo cityname={country.capital[0]} weatherData={weatherData}></WeatherInfo>
    </div>
  </div>
  )
}

const CountryInfo = ({allCountries, filter, onShowCountryInfoButtonClick}) => {
  if(allCountries === null || allCountries.length === 0) {
    return (
      <NoCountryToShow msg={'Country information not loaded yet'}></NoCountryToShow>
    )
  }

  const filtered = filter === null || filter.length === 0
    ? allCountries
    : allCountries.filter((c) => c.name.common.toLowerCase().includes(filter.toLowerCase()))

  if(filtered.length > 10) {
    return (
      <NoCountryToShow msg={'Too many matches, specify another filter'}></NoCountryToShow>
    )
  } 
  else if (filtered.length > 1) {
    return (
      <CountryNameList countries={filtered} onShowCountryInfoButtonClick={onShowCountryInfoButtonClick}></CountryNameList>
    )
  } 
  else if(filtered.length === 1) {
    return (
      <CountryDetailInfo country={filtered[0]}></CountryDetailInfo>
    )
  } 
  else {
    return (
      <NoCountryToShow msg={'No matches'}></NoCountryToShow>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  // On first render fetch info of all countries.
  useEffect(() => {
    console.log('first render: useEffect')
    axios
      .get(countriesBasePath.concat(allCountriesPath).concat(countriesRequiredInfo))
      .then(response => {
        console.log(response.data)
        setCountries(response.data) 
      })
  }, [])

  const onFilterChange = (event) => { setFilter(event.target.value) }

  const onShowCountryInfoButtonClick = (country) => {
    console.log('button pressed: ', country)
    setFilter(country.name.common)
  }

  return (
    <div className="App">
      <h1>Countries</h1>
      <form>
        <div>
          find countries: <input value={filter} onChange={onFilterChange}></input>
        </div>
      </form>
      <br></br>
      <CountryInfo allCountries={countries} filter={filter} onShowCountryInfoButtonClick={onShowCountryInfoButtonClick}></CountryInfo>
    </div>
  );
}

export default App;
