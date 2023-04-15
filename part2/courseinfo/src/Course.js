const Header = ({name}) => {
    return (
     <h2> { name } </h2> 
    )
  }
  
const Part = ({name, numEx}) => {
  return (
    <li> { name } { numEx } </li> 
    )
}

const Content = ({parts}) => {
  return (
    parts.map(p => <Part name = { p.name } numEx = { p.excercises} key = { p.id }/>)
  )
}

const Total = ({parts}) => {
  const numExercises = parts.reduce((total, part) => total + part.excercises, 0)
  return (
    <span style={{fontWeight: 'bold'}}>
      <p> Number of excercises { numExercises } </p> 
    </span>
    )
}

const Course = ({name, parts}) => { 
  return (
  <div>
      <Header name = { name } />
      <ul>
        <Content parts = { parts } />
      </ul>
      <Total parts = { parts } />
  </div>
  )
}

const CourseList = ({courseInfos}) => {
  return (
    courseInfos.map((ci) => <Course name = { ci.name } parts = { ci.parts } key = { ci.id } />)
  )
}

export default CourseList