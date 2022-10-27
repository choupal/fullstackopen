import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad, stats }) => {
  return (
    <>
      <Header text={"Statistics"} />
      {stats.all === 0 ? (
        <p>NoFeedback</p>
      ) : (
        <>
          <table>
            <tbody>
              <StatisticLine text={"good"} value={good} />
              <StatisticLine text={"neutral"} value={neutral} />
              <StatisticLine text={"bad"} value={bad} />
              <StatisticLine text={"all"} value={stats.all} />
              <StatisticLine text={"average"} value={stats.average} />
              <StatisticLine text={"positive"} value={stats.positive} />
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);

  const getStats = (good, neutral, bad) => {
    const all = good + neutral + bad;
    const average = ((good - bad) / all).toFixed(1);
    const positive = `${((good / all) * 100).toFixed(1)} %`;
    return { all, average, positive };
  };

  return (
    <>
      <Header text={"Give Feedback"} />
      <Button handleClick={incrementGood} text={"good"} />
      <Button handleClick={incrementNeutral} text={"neutral"} />
      <Button handleClick={incrementBad} text={"bad"} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        stats={getStats(good, neutral, bad)}
      />
    </>
  );
};

export default App;
