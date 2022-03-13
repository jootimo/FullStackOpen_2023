const Header = (props) => {
  return (
   <h1> { props.course } </h1> 
  )
}

const Part = (props) => {
  return (
    <p> { props.part } { props.numEx } </p> 
   )
}

const Content = (props) => {
  return (
    <div>
      <Part part = { props.part1 } numEx = { props.numEx1 } /> 
      <Part part = { props.part2 } numEx = { props.numEx2 } /> 
      <Part part = { props.part3 } numEx = { props.numEx3 } /> 
    </div>
  )
}

const Total = (props) => {
  return (
    <p> Number of excercises { props.numEx } </p> 
   )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course = { course } />
      <Content  part1 = { part1 } numEx1 = { exercises1 }
                part2 = { part2 } numEx2 = { exercises2 }
                part3 = { part3 } numEx3 = { exercises3} />

      <Total numEx = { exercises1 + exercises2 + exercises3 } />                
    </div>
  )
}

export default App