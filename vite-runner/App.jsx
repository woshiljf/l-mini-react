import React from './core/React.js';

function Foo() {
  // const update = React.update();
  const [count, setCount] = React.useState(100);
  const [bar, setBar] = React.useState('bar');
  const handleClick = () => {
    setCount(value => value + 100);

    setBar('xxxxxxxxxx');
  };

  React.useEffect(() => {
    console.log('1');
    return () => {
      console.log('1---clearUp');
    };
  }, [3]);

  React.useEffect(() => {
    console.log('2');

    return () => {
      console.log('2---clearUp');
    };
  }, [1]);

  React.useEffect(() => {
    console.log('count', count);
    return () => {
      console.log('count---clearUp');
    };
  }, [count]);

  return (
    <div>
      {count}
      {bar}
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

function App() {
  const update = React.update();
  const handleClick = () => {
    update();
  };

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
