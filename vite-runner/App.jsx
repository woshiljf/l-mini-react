import React from './core/React.js';

// function Count1({ num }) {
//   return <div>num: {num}</div>;
// }

let count = 100;
let props = { id: 'xxxx', b: 'yyy' };
function CountContainer({ num }) {
  const handleClick = () => {
    count++;
    console.log('3423');
    props = {};
    React.update();
  };

  return (
    <div {...props}>
      {count}
      <button onClick={handleClick}>点击我一下</button>
    </div>
  );
}

function App() {
  return (
    <div id="llll">
      我是大海狗{count}
      <CountContainer num={1000000}></CountContainer>
    </div>
  );
}

// const App = (
//   <div>
//     我是大海狗
//     <CountContainer num={142342}></CountContainer>
//   </div>
// );

export default App;
