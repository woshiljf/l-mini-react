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

// const render = (el, container) => {
//   const dom =
//     el.type === 'TEXT_ELEMENT'
//       ? document.createTextNode('')
//       : document.createElement(el.type);

//   // 给dom 设置属性

//   const _props = el.props;

//   Object.keys(_props).forEach(key => {
//     if (key !== 'children') {
//       dom[key] = _props[key];
//     }
//   });

//   // 处理children
//   const _children = el.props.children;

//   _children.forEach(child => {
//     render(child, dom);
//   });

//   container.append(dom);
// };
let nextFiberOfUnit = null;

const render = (el, container) => {
  nextFiberOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  performFiberOfUnit(nextFiberOfUnit);
};

const createDom = type => {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
};

const updateDomProps = (dom, props) => {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
};

const initChild = fiber => {
  const children = fiber.props.children;
  let preChild = null;

  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preChild.sibling = newFiber;
    }

    preChild = newFiber;
  });
};

const performWorkUntil = fiber => {
  // 0. 如果没有dom，再创建
  if (!fiber.dom) {
    //1. 创建dom
    const dom = createDom(fiber.type);
    fiber.dom = dom;
    fiber.parent.dom.append(dom);
    //2. 给 dom 设置属性props
    updateDomProps(dom, fiber.props);
  }

  //3. 找一下child 节点

  initChild(fiber);

  //4. 子节点找完，找兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  // 5，返回兄弟节点
  if (fiber.sibling) {
    return fiber.sibling;
  }
  //6 兄弟节点没有了，返回父节点

  return fiber.parent.sibling;
};

const fiberLoop = deadline => {
  //1. 创建dom
  let shouldYield = false;

  while (!shouldYield && nextFiberOfUnit) {
    nextFiberOfUnit = performWorkUntil(nextFiberOfUnit);
    console.log('111', deadline.timeRemaining());
    if (deadline.timeRemaining() < 1) {
      shouldYield = true;
    }
    requestIdleCallback(fiberLoop);
  }
};

requestIdleCallback(fiberLoop);

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
