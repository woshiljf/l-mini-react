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
        if (typeof child === 'string' || typeof child === 'number') {
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
// 原始的dom 对象
let wipRoot = null;
// 新的dom 对象

let currentRoot = null;
let wipFiber = null;
let deleteList = [];

const render = (el, container) => {
  nextFiberOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  wipRoot = nextFiberOfUnit;
  performWorkUnit(nextFiberOfUnit);
};

const createDom = type => {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
};

const updateDomProps = (dom, nextProps, prevProps) => {
  // Object.keys(preProps).forEach(key => {
  // //   if (key !== 'children') {
  // //     if (key.startsWith('on')) {
  // //       const eventType = key.slice(2).toLowerCase();
  // //       dom.addEventListener(eventType, preProps[key]);
  // //     }
  // //     dom[key] = preProps[key];
  // //   }
  // // });

  // 更新props
  //1. old 有，new 没有，就删除
  //2. old 没有，new 有，就添加
  //3. old 有，new 有，就修改

  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!nextProps[key]) {
        dom && dom?.removeAttribute?.(key);
      }
    }
  });

  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
};

const reconcileChild = (fiber, children) => {
  let preChild = null;
  let oldFiber = fiber?.alternate?.child;
  let newFiber = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;

    // 如果是相同的，表示更新
    if (isSameType) {
      // 如果类型是相同的，就走更新的逻辑
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'update',
        alternate: oldFiber,
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement',
        };
      }

      if (oldFiber) {
        deleteList.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preChild.sibling = newFiber;
    }

    if (newFiber) {
      preChild = newFiber;
    }
  });

  while (oldFiber) {
    deleteList.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
};

const updateFunctionComponent = fiber => {
  wipFiber = fiber;
  currentHookIndex = 0;
  stateHooks = [];
  reconcileChild(fiber, [fiber.type(fiber.props)]);
};

const updateHostComponent = fiber => {
  if (!fiber.dom) {
    const dom = createDom(fiber.type);
    fiber.dom = dom;
    // fiber.parent.dom.append(dom);
    //2. 给 dom 设置属性props
    updateDomProps(dom, fiber.props, {});
  }
  reconcileChild(fiber, fiber.props.children);
};

const performWorkUnit = fiber => {
  // 0. 如果没有dom，再创建
  const isFunctionComponent = typeof fiber.type === 'function';

  if (isFunctionComponent) {
    //1. 创建dom
    updateFunctionComponent(fiber);
  }

  if (!isFunctionComponent) {
    //1. 创建dom
    updateHostComponent(fiber);
  }

  //4. 子节点找完，找兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  // 5，返回兄弟节点
  // if (fiber.sibling) {
  //   return fiber.sibling;
  // }
  //6 兄弟节点没有了，返回父节点的兄弟节点

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }

  return fiber.parent.sibling;
};

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;

    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }

    fiberParent?.dom?.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitRoot() {
  const newDeleteList = deleteList.filter(Boolean);
  newDeleteList.forEach(commitDeletion);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deleteList = [];
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === 'update') {
    updateDomProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
const fiberLoop = deadline => {
  //1. 创建dom
  let shouldYield = false;
  while (!shouldYield && nextFiberOfUnit) {
    nextFiberOfUnit = performWorkUnit(nextFiberOfUnit);

    if (wipRoot?.sibling?.type === nextFiberOfUnit?.type) {
      nextFiberOfUnit = null;
    }
    if (deadline.timeRemaining() < 1) {
      shouldYield = true;
    }

    // 如果nextFiberUnit 没有值的时候，说明已经到了之后一个节点了
    if (!nextFiberOfUnit && wipRoot) {
      commitRoot();
    }
  }
  requestIdleCallback(fiberLoop);
};

requestIdleCallback(fiberLoop);

// const update = () => {
//   let currentFiber = wipFiber;

//   return () => {
//     wipRoot = {
//       ...currentFiber,
//       alternate: currentFiber,
//     };
//     nextFiberOfUnit = wipRoot;
//   };
// };

// 第一步是，当我们改了某个属性之后，需要手动再再次调用update 进行更新比较
const update = () => {
  let currentFiber = wipFiber;

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextFiberOfUnit = wipRoot;
  };
};

/**
 * 实现useState
 *
 * 1. 实现一个useState，
 * 2. 如何存储之前的state，当函数组件在更新的时候，能拿到渲染之前的值
 * 3. 如何解决多个state 同时调用的情况
 * 4. 可以使用hooks ，和索引值去解决
 * 5. 如何解决state 批量更新的问题
 *
 *
 *
 */

let currentHookIndex;
let stateHooks;
function useState(initValue) {
  let currentFiber = wipFiber;

  const oldHook = currentFiber?.alternate?.stateHooks[currentHookIndex];

  let stateHook = {
    state: oldHook ? oldHook.state : initValue,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state);
  });

  stateHook.queue = [];

  currentHookIndex++;

  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    // stateHook.state = action(stateHook.state);

    const eagerState =
      typeof action === 'function' ? action(stateHook.state) : () => action;

    // 如果更新前后的值是相等的，直接返回，减少没必要的更新；
    if (eagerState === stateHook.state) {
      return;
    }

    stateHook.queue.push(typeof action === 'function' ? action : () => action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextFiberOfUnit = wipRoot;
  }

  return [stateHook.state, setState];
}

/**
 * 实现
 */

const React = {
  render,
  createElement,
  update,
  useState,
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
