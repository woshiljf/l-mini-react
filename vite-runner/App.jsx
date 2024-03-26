import React from './core/React.js';

function Count1({ num }) {
  return <div>num: {num}</div>;
}

function CountContainer({ num }) {
  return <div>2</div>;
}

function App() {
  return (
    <div id="llll">
      我是大海狗
      <div>
        <div>
          1
          <div>
            2<div>3</div>
          </div>
        </div>
        <div>44</div>
      </div>
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
