import React from './core/React.js';

function Count1({ num }) {
  return <div>num: {num}</div>;
}

function CountContainer({ num }) {
  return <Count1 num={num}>2</Count1>;
}

function App() {
  return (
    <div>
      mini-react
      <CountContainer num={1000}></CountContainer>
      <Count1 num={5000}></Count1>
    </div>
  );
}

// const App = (
//   <div>
//     我是大海狗
//     <CountContainer></CountContainer>
//   </div>
// );

export default App;
