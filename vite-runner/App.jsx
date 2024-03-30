import React from './core/React.js';

// function Count1({ num }) {
//   return <div>num: {num}</div>;
// }

let count = 100;
let showBar = false;
let showDiv = false;
let props = { id: 'xxxx', b: 'yyy' };

function Foo() {
  const update = React.update();
  const handleClick = () => {
    update();
  };
  console.log('foo');
  return (
    <div>
      <button onClick={handleClick}>我是Foo</button>
    </div>
  );
}

function Bar() {
  const update = React.update();

  const handleClick = () => {
    update();
  };
  console.log('bar');

  return (
    <div>
      <button onClick={handleClick}>我是bar</button>
    </div>
  );
}
function CountContainer({ num }) {
  const handleClick = () => {
    count++;
    console.log('3423');
    props = {};
    showBar = !showBar;
    showDiv = !showDiv;
    React.update();
  };

  return (
    <div {...props}>
      {count}
      {showDiv && <div>33333</div>}

      <button onClick={handleClick}>点击我一下{num}</button>
    </div>
  );
}

function App() {
  const update = React.update();
  const handleClick = () => {
    update();
  };
  console.log('app');

  return (
    <div id="llll">
      <div>
        <button onClick={handleClick}>我是app</button>
      </div>
      <Foo />
      <Bar />
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
