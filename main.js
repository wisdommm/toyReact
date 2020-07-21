
// require('./lib.js');

// for(let i of [6,6,6])
//     console.log(i)

// console.log('main');

import {toyReact, Component} from './toyReact.js';

// let a = <MyComponent name='123' />;

// let a = <MyComponent name='div'>
//     <p id='666'>123</p>
//     <p id='666'>123</p>
//     <p id='666'>123</p>
// </MyComponent>

class MyComponent extends Component{
    
    render(){
        return <div>
            <p>123</p>
            <h1>1111</h1>
            <div>
                {this.children}
            </div>
        </div>
    }
}

let a = <MyComponent name='id' name='name'></MyComponent>

// document.body.appendChild(b);

toyReact.render(a , document.body);

