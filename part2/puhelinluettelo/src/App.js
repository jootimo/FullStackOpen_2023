import { useState, useEffect } from 'react'
import axios from 'axios'

const Contact = ({name, number}) => {
  return (
    <p> {name} {number} </p>
  )
}

const ContactList = ({persons, filter}) => {
  console.log('persons', persons);
  const filtered = filter.length === 0
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
  console.log('filtered', filtered);
  return (
    filtered.map((p) => <Contact key = {p.name} name = {p.name} number = {p.number} />) 
  )  
}

const FilterForm = ({onFilterChange}) => {
  return (
    <form>
      <div>
        filter shown with <input onChange={onFilterChange}/>
      </div>
    </form>
  )
} 

const NewContactForm = ({onFormSubmit, newName, onNameInputChange, newNumber, onNumberInputChange}) => {
  return (
    <form onSubmit={onFormSubmit}>
        <div>
          name: <input value={newName} onChange={onNameInputChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect');
    axios
      .get('http://localhost:3001/db')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data.persons)
      })
  }
  useEffect(hook, [])
  

  const nameAlreadyExists = (name) => {
    const withSameName = persons.filter(p => p.name === name)  
    return withSameName.length > 0 
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    
    if(nameAlreadyExists(newName)) {
      alert(`${newName} is already added to photobook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const onNameInputChange = (event) => {
    setNewName(event.target.value)    
  }
  const onNumberInputChange = (event) => {
    setNewNumber(event.target.value)    
  }

  const onFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm onFilterChange={onFilterChange}/>
      <h2>Add a new contact</h2>
      <NewContactForm 
        onFormSubmit={onFormSubmit} 
        newName={newName} 
        onNameInputChange={onNameInputChange} 
        newNumber={newNumber} 
        onNumberInputChange={onNumberInputChange} 
      />
      <h2>Numbers</h2>
      <div>
        <ContactList persons={persons} filter={filter}/>
      </div>
    </div>
  )

}

export default App