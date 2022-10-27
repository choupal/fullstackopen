const Header = ({ course }) => <h2>{course.name}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) =>
  parts.map((part) => <Part key={part.exercises} part={part} />);

const Total = ({ parts }) => {
  const total = parts.reduce(
    (acc, currentValue) => acc + currentValue.exercises,
    0
  );
  return <p style={{ fontWeight: "bold" }}>Number of exercises {total}</p>;
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;
