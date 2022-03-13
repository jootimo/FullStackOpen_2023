const Header = (props) => {
  return (
   <h1> { props.course.name } </h1> 
  )
}

const Part = (props) => {
  return (
    <p> { props.name } { props.numEx } </p> 
   )
}

const Content = (props) => {
  return (
    props.course.parts.map(p => <Part name = { p.name } numEx = { p.excercises} />)
  )
}

const Total = (props) => {
  const numExercises = props.course.parts.reduce((total, part) => total + part.excercises, 0)
  return (
    <p> Number of excercises { numExercises } </p> 
   )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      { 
        name: 'Fundamentals of React',
        excercises: 10
      },
      { 
        name: 'Using props to pass data',
        excercises: 7
      },
      { 
        name: 'State of a component',
        excercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course = { course } />
      <Content course = { course } />
      <Total course = { course } />                
    </div>
  )
}

export default App