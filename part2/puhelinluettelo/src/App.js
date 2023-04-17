import { useState, useEffect } from 'react'
import personService from './services/Persons'

const Contact = ({person, onDelete}) => {
  return (
    <li> 
      {person.name} {person.number} 
      <button onClick= {onDelete}>delete</button>
    </li>
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

  const fillPersonList = () => {
    personService.getAll()
      .then(allPersons => {
          console.log('Got persons from server:', allPersons)
          setPersons(allPersons)
      })
      .catch(error => alert('failed to get persons from server:', error))
  }
  useEffect(fillPersonList, [])

  const onFormSubmit = (event) => {
    event.preventDefault()

    // Update the number if the person already exists on the server 
    const withSameName = persons.find(p => p.name === newName)
    if(withSameName !== undefined) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...withSameName, number: newNumber}
        personService.update(updatedPerson)
          .then(updateResponse => {
            console.log('person updated: ', updateResponse)
            setPersons(persons.map(p => p.id === updateResponse.id ? updateResponse : p)) 
            setNewName('')
            setNewNumber('')
          })
          .catch(error => alert(`failed to update person ${updatedPerson}:`, error))
      }
      return
    }

    // Otherwise create a new person
    const newPerson = {
      name: newName,
      number: newNumber
    }
    personService.create(newPerson)
      .then(createdPerson => {
        console.log('Created a new person on the server:', createdPerson)
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => alert(`failed to create new person ${newPerson}:`, error))
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

  const onDelete = (person) => {
    if(window.confirm(`Delete ${person.name}?`)) {
        console.log('deleting person:', person);
        personService.remove(person.id)
          .then(() => fillPersonList())
          .catch(error => alert(`failed to delete person ${person}:`, error))
    }
  }

  const filtered = filter.length === 0
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

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
      <ul>
        {filtered.map((p) => <Contact key = {p.id} person = {p} onDelete = {() => onDelete(p)} />) }
      </ul>
    </div>
  )

}

export default App