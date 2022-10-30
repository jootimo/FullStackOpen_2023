import { useState } from 'react'

const Button = (props) => <button onClick={props.onClick}> {props.text} </button> 

const Statistics = (props) => {
  const getNumFeedback = (props) => props.good + props.bad + props.neutral

  const Title = () => {
    return <h1>statistics</h1>
  }

  if(getNumFeedback(props) === 0) {
    return (
      <div>
        <Title/>
        No feedback Given
      </div>
    )
  }

  const StatisticsLine = (props) => {
    return (
      <tr>
        <td>
          {props.text} 
        </td>
        <td>
          {props.value} {props.suffix}
        </td>
      </tr>
    )
  }

  const round = (n) => { return Math.round(n * 100) / 100 }

  const getAverage = (props) => {
    const total = getNumFeedback(props)
    return total === 0
      ? 0.0
      : round(((1 * props.good) + (0 * props.neutral) + (-1 * props.bad)) / total)
  }

  const getPositiveRatio = (props) => {
    const total = getNumFeedback(props)
    return total === 0
      ? 0.0
      : round(props.good / total)
  }

  return (
    <div>
        <Title/>
        <table>
          <tbody>
            <StatisticsLine text = 'good' value = {props.good}/>
            <StatisticsLine text = 'neutral' value = {props.neutral}/>
            <StatisticsLine text = 'bad' value = {props.bad}/>
            <StatisticsLine text = 'all' value = {props.good + props.bad + props.neutral}/>
            <StatisticsLine text = 'average' value = {getAverage(props)}/>
            <StatisticsLine text = 'positive' value = {getPositiveRatio(props) * 100} suffix = '%'/>
          </tbody>
        </table>
    </div>
  )
}

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
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
      </div>
    </div>
  )   
}


export default App;
