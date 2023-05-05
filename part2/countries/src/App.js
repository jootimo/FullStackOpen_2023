import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const basePath = 'https://restcountries.com/v3.1/'
const allCountriesPath = 'all'
const requiredInfo = '' //filtering doesn't seem to work due to some CORS error: '?fields=name,capital,area,languages,flags`'

const NoCountryToShow = ({msg}) => { return (
  <div> {msg} </div>
  ) 
}
const CountryNameList = ({countries}) => {
  console.log('showing a list of countries: ', countries)

  return  (
    <div>
        <ul>
          {countries.map((c) => <li key={c.name.common}> {c.name.common} </li>)}
        </ul>
    </div>
  )
}
const CountryDetailInfo = ({country}) => {
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
  </div>
  )
}

const CountryInfo = ({allCountries, search: filter}) => {
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
      <CountryNameList countries={filtered}></CountryNameList>
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
      .get(basePath.concat(allCountriesPath).concat(requiredInfo))
      .then(response => {
        console.log(response.data)
        setCountries(response.data) 
      })
  }, [])

  const onFilterChange = (event) => { setFilter(event.target.value) }

  return (
    <div className="App">
      <h1>Countries</h1>
      <form>
        <div>
          find countries: <input value={filter} onChange={onFilterChange}></input>
        </div>
      </form>
      <br></br>
      <CountryInfo allCountries={countries} search={filter}></CountryInfo>
    </div>
  );
}

export default App;
