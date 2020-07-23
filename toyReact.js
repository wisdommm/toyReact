class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
        this.props = Object.create(null);
        this.children = [];

    }
    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
            this.root.addEventListener(eventName, value);
        }
        if(name === 'className') {
            name = 'class'
        }
        this.root.setAttribute(name, value);
        // this.props[name] = value;
    }
    appendChild(vChild) {
        // let range = document.createRange();
        // if(this.root.children.length) {
        //     range.setStartAfter(this.root.lastChild);
        //     range.setEndAfter(this.root.lastChild);
        // } else {
        //     range.setStart(this.root, 0);
        //     range.setEnd(this.root, 0);
        // }
        // vChild.mountTo(range)
        this.children.push(vChild);
    }
    mountTo(range) {
        range.deleteContents();
        // range.insertNode(this.root);
        let element = document.createElement(this.type);
        for(let name in this.props){
            let value = this.props[name];
            element.setAttribute(name,value);
        }
    }
}
  
  
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = '#text';
        this.children = [];
        this.props = Object.create(null);
    }
    mountTo(range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}
  
  
export class Component {
    constructor(){
        this.children = [];
        this.props = Object.create(null)
    }
    setAttribute(name, val) {
        if(name.match(/^on([\s\S]+)$/)) {
            console.log(1)
        }
        this.props[name] = val;
        this[name] = val;
    }
    mountTo(parent) {
        // 调用实际组件的render函数
        let vdom = this.render();
        vdom.mountTo(parent);
        // this.range = range;
        // this.update();
    }
    get type(){
        return this.constructor.name;
    }
    update() {
        let placeholder = document.createComment('placeholder');
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset)
        range.setEnd(this.range.endContainer, this.range.endOffset)
        range.insertNode(placeholder)
    
        this.range.deleteContents();
    
        // render 函数生成出来的就是 ElementWrapper
        let vdom = this.render()
        vdom.mountTo(this.range)  
        
        // let vdom = this.render();
        
        // if(vdom){
        //     let isSameNode = (node1,node2)=>{
        //         if(node1.type !== node2.type) return false;
        //         for(let name in node1.props){
        //             if(node1.props[name] !== node2.props[name]) return false;
        //         }
        //         if( Object.keys(node1.props).length !== Object.keys(node2.props).length )return false;
        //     }
        //     let isSameTree = (node1,node2)=>{
        //         if( !isSameNode(node1,node2) ) return false;
        //         if( node1.children.length !== node2.children.length ) return false;
        //         for(let i = 0 ; i < node1.children.length ; i++){
        //             if( !isSameTree(node1.children[i],node2.children[i]) ) return false;
        //         }
        //         return true;
        //     }
            
        //     let replace = (newTree , oldTree)=>{

        //     }

        //     replace(vdom,this.vdom);

        //     if(isSameTree(vdom,this.vdom)) return;

        //     console.log('new',vdom);
        //     console.log('old',this.vdom);
        // }else{

        // }
        // this.vdom = vdom;
    }
    
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if(typeof newState[p] === 'object' && newState[p] !== null) {
                    if(typeof oldState[p] !== 'object') {
                        if(newState[p] instanceof Array)
                            oldState[p] = [];
                        else
                            oldState[p] = {};
                    }
                    merge(oldState[p], newState[p])
                } else {
                    oldState[p] = newState[p]
                }
            }
        }
        if(!this.state && state) {
            this.state = {}
        }
        merge(this.state, state)
        this.update()
    }
}
  
export let toyReact = {
    //babel/plugin-transform-react-jsx 插件会递归地调用这个函数
    createElement(type, attributes, ...children) {
        let ele = undefined;
        // 如果是一个真实dom
        if(typeof type === 'string') {
            ele = new ElementWrapper(type)
        // 如果是一个组件, type 是一个组件的 class，此时就需要 new 出实例
        } else {
            ele = new type
        }
        // 把自身的属性都添加到节点上
        for(let name in attributes) {
            ele.setAttribute(name, attributes[name])
        }
        // 插入子节点数组
        let insertChildren = (children) => {
            for(let child of children) {
            // 如果还是个数组，则继续递归
                if(typeof child === 'object' && child instanceof Array) {
                    insertChildren(child)
                } else {
                    if(child === null || child === void 0 )
                        child = '';
                    if(!(child instanceof Component)
                    && !(child instanceof ElementWrapper)
                    && !(child instanceof TextWrapper)) {
                        // 不是这三种节点的，全部转为字符串
                        child = String(child)
                    }
                    if(typeof child === 'string') {
                        child = new TextWrapper(child)
                    }
                    ele.appendChild(child)
                }
            }
        }
        insertChildren(children)
        return ele
    },
        // 只用于渲染根组件
    render(vdom, element) {
        let range = document.createRange();
        if(element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        vdom.mountTo(range)
    }
};
  
  // 整个过程就是 babel/plugin-transform-react-jsx 把我们的 jsx 一个一个调用我们写的 createElement，然后再分别遍历他们的子节点，对子节点进行渲染。
  // 如果是一个组件，则调用 render 函数生成对应的 ElementWrapper 实例，再用 ElementWrapper 的 mountTo ，把真实 dom append 到 parent上
  // 如果是一个普通 dom，则 new ElementWrapper 实例，生成真实 dom，然后 append 到 this.root 上去。
  
  // day 2
  // 每当调用 appendChild 的时候，会调用子节点的 mountTo 方法把实 DOM 绑定到父节点上。
  // 新增了 setState 的功能，并且在 setState 的时候更新视图。
  // 1. 为 Component 类增加了 state 属性和 setState 方法，每次 setState 的时候都递归更新 state（深拷贝）
  // 2. 每次 setState 过后，都把前面的视图给删掉，然后调用 render 函数，使用 createElement 生成新的 vdom，重新 mount 到父节点上。