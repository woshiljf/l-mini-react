- jsx 是如何编译dom 节点的，jsx → 虚拟dom → js object → html

- reactDom.createElememt（'#root', <App />）

- v-dom → js 对象

- 实现render 函数

-  实现ReactDom, ReactDom.createDom('container').render('app')

- 如何使用jsx → vdom。


1. v-dom

```jsx
const div = {
    "type": "div",
    "props": {
        "id": "app",
        "class": "app",
        "children": [
            {
                "type": "TEXT_ELEMENT",
                "props": {
                    "id": "text",
                    "nodeValue": "text",
                    "children": []
                }
            }
        ]
    }
}

```

2. 如何将这样的一个这样的一个v-dom 结构 ，转化为dom节点。
 - 首先有一个函数createElement函数（其实就是这个函数创建出来单个dom 结构），变成单个dom 节点，或者嵌套多个dom 节点
 - 有个render 方法，将v-dom 对象结构 → 真实的dom。

3. React.createElement

```jsx
const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string') {
          return createTextNode(child);
        }
        return child;
      }),
    },
  };
};


```
4. render 方法

```
 * 
 */

// 1. 根据app 这个dom 对象，转化为dom 节点，需要实现一个render 函数

const render = (el, container) => {
  const dom =
    el.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(el.type);

  // 给dom 设置属性

  const _props = el.props;

  Object.keys(_props).forEach(key => {
    if (key !== 'children') {
      dom[key] = _props[key];
    }
  });

  // 处理children
  const _children = el.props.children;

  _children.forEach(child => {
    render(child, dom);
  });

  container.append(dom);
};
```

4. 完整的流程

    - 路径core/React.js

```jsx
  const createTextNode = text => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      id: 'text',
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string') {
          return createTextNode(child);
        }
        return child;
      }),
    },
  };
};

/**
 * 
 * 
 * {
    "type": "div",
    "props": {
        "id": "app",
        "class": "app",
        "children": [
            {
                "type": "TEXT_ELEMENT",
                "props": {
                    "id": "text",
                    "nodeValue": "text",
                    "children": []
                }
            }
        ]
    }
}
 * 
 */

// 1. 根据app 这个dom 对象，转化为dom 节点，需要实现一个render 函数

const render = (el, container) => {
  const dom =
    el.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(el.type);

  // 给dom 设置属性

  const _props = el.props;

  Object.keys(_props).forEach(key => {
    if (key !== 'children') {
      dom[key] = _props[key];
    }
  });

  // 处理children
  const _children = el.props.children;

  _children.forEach(child => {
    render(child, dom);
  });

  container.append(dom);
};
// 导出两个方法，render，和createElement
const React = {
  render,
  createElement,
};

// function hello() {
//   const a = 1;
//   return /*#__PURE__*/ React.createElement(
//     'div',
//     null,
//     /*#__PURE__*/ React.createElement('div', null, {
//       a,
//     }),
//     /*#__PURE__*/ React.createElement('div', null, {
//       a,
//     }),
//     /*#__PURE__*/ React.createElement('div', null, {
//       a,
//     })
//   );
// }

export default React;

```


  - 路径core/ReactDom.js

  ```jsx
      import React from './React.js';
// ReactDom 对象
const ReactDom = {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};
export default ReactDom;

  ```

  - 使用
  ```jsx
   // src/app.js
import React from './core/React.js';
const App = React.createElement(
  'div',
  { id: 'app', class: 'app' },
  '2222332222'
);

export default App;


// src/index.js
import ReactDom from './core/ReactDom.js';
import App from './App.js';
const container = document.getElementById('root');

ReactDom.createRoot(container).render(App);


  ```