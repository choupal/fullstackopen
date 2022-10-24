const Hello = (props) => {
  return (
    <div>
      <p>Hello There {props.name}, you are {props.age} years old</p></div>
  )
}

const App = () => {
  const name = "Obi-Wan"
  const age = 30
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="General" age={26+11} />
      <Hello name={name} age={age}/>
    </>
  )
}

export default App