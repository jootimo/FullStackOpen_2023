import { useState } from 'react'

const Button = (props) => <button onClick={props.onClick}> {props.text} </button> 

const App = (props) => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0)

  const getOnClick = (setState, state) => 
    () => { setState(state) }

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button onClick={getOnClick(setGood, good + 1)} text={'good'}/> 
        <Button onClick={getOnClick(setNeutral, neutral + 1)} text={'neutral'}/>
        <Button onClick={getOnClick(setBad, bad + 1)} text={'bad'}/>
      </div>
      <div>
        <h1>statistics</h1>
        good {good} <br/>
        neutral {neutral} <br/>
        bad {bad} <br/>
      </div>
    </div>
  )   
}


export default App;
