import { useState, useEffect } from 'react'
import personService from './services/Persons'

const Contact = ({person, onDelete}) => {
  const style = {
    color: 'grey',
    paddingTop: 5,
    fontSize: 15
  }
  return (
    <li style={style}> 
      {person.name} {person.number} 
      <button onClick= {onDelete}>delete</button>
    </li>
  )
}

const Notification = ({notification}) => {
  if(notification === null){
    return null 
  }
  return (
    <div style={notification.style}>
      {notification.message}
    </div>
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
  const [notification, setNotification] = useState(null)

  const setNotificationMessage = (msg, stl) => {
    if(msg === null)  {
      setNotification(null)
    }
    setNotification({message: msg, style: stl})
    setTimeout(() => setNotification(null), 5000)
  }

  const setErrorMessage = (message) => {
    const errorStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    setNotificationMessage(message, errorStyle)
  }

  const setInfoMessage = (message) => {
    const infoStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    setNotificationMessage(message, infoStyle)
  }

  const fillPersonList = () => {
    personService.getAll()
      .then(allPersons => {
          console.log('Got persons from server:', allPersons)
          setPersons(allPersons)
      })
      .catch(error => console.log('failed to get persons from server:', error))
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
            setInfoMessage(`Updated ${updateResponse.name}`)
            setPersons(persons.map(p => p.id === updateResponse.id ? updateResponse : p)) 
            setNewName('')
            setNewNumber('')
          })
          .catch(error => setErrorMessage(`Failed to update ${updatedPerson.name}:`))
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
        setInfoMessage(`Created ${createdPerson.name}`)
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => setErrorMessage(`Failed to create ${newPerson.name}`))
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
          .then(() => {
            setInfoMessage(`Deleted ${person.name}`)
            fillPersonList()
          }) 
          .catch(error => {
            setErrorMessage(`Information of ${person.name} has already been removed from the server.`)
            fillPersonList()
          })       
    }
  }

  const filtered = filter.length === 0
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}></Notification>
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