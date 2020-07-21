


class ElementWrapper {
    constructor(type){
        this.root = document.createElement(type);
    }
    setAttribute(key,value){
        this.root.setAttribute(key , value);
    }
    appendChild(vchild) {
        vchild.mountTo(this.root);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }

}

class TextWrapper {
    constructor(type){
        this.root = document.createTextNode(type);
    }
    setAttribute(key,value){
        this.root.setAttribute(key , value);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }

}

export class Component{
    constructor(){
        this.children = [];
    }
    mountTo(parent){
        let vdom = this.render();
        vdom.mountTo(parent);
    }
    setAttribute(name, value){
        this[name] = value;
    }
    appendChild(vchild){
        this.children.push(vchild);
    }
} 

export const toyReact = {
    createElement( type , attributes , ...children ){
        console.log(arguments);
        let ele;

        if(typeof type === 'string'){
            ele = new ElementWrapper(type);
        }else{
            ele = new type;
        }
        
        for(let name in attributes){
            ele.setAttribute(name , attributes[name]);
        }
        
        // for(let child of children){
        //     if(typeof child === 'string'){
        //         child = new TextWrapper(child);
        //     }
        //     ele.appendChild(child);
        // }
        
        let insertChildren = children => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWrapper)
                        && !(child instanceof TextWrapper)) {
                        child = String(child);
                    }
                    if (typeof child === 'string') {
                        child = new TextWrapper(child);
                    }
                    element.appendChild(child);
                }
            }
        };
        insertChildren(children);

        return ele;
    },
    render(vdom , element){
        vdom.mountTo(element);
    }
}