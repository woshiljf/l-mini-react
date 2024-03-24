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

const React = {
  render,
  createElement,
};

export default React;
