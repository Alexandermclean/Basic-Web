## 1.基本概念
1.constructor方法默认返回实例对象（即this）  
2.__proto__是隐式原型，指向构造函数的原型（对象都有）  
3.prototype构造函数才有，创建的对象实例  

```javascript
var fn = function fun () {
	this.getName = function () {return fun.name}
}
console.log((new fn()).constructor === fn) // true
console.log((new fn()).__proto__ === fn.prototype) // true
```

定义在构造函数内部的方法，在实例化的时候都会重新定义一遍；而定义在原型链上的方法，所有实例对象都会共享（指针指向）

> 实例对象.\_proto\_ === 构造函数.prototype；  
\_proto\_: 隐式原型，指向构造函数的原型；所有对象都有。  
prototype: 构造函数创建的对象实例；只有函数才有。

```javascript
var person = function () {
	this.name = 'yzh'
	this.getName = function () {
		return 'from this'
	}
}

person.prototype.getName = function () {
	return 'from prototype'
}

var yyy = new person()
yyy.getName = function () {
	return 'private function'
}

yyy.getName() // 'private function'
```

三种为对象申明方法的方式，其中优先级是  内部方法 > this > prototype定义，优先级高的方式申明的方法会覆盖底的方法

## 2.继承
[阮一峰日志介绍](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)

## 3.new操作符
```javascript
var obj = new Base()

// 真正内部操作

var obj = {}
obj._proto_ = Base.prototype
Base.call(obj) // 将Base构造函数的作用域赋值给obj，this指向

```

## 4.super关键字
this关键字总是指向函数所在的当前对象，ES6又新增了另一个类似的关键字super，指向当前对象的原型对象。
```javascript
const proto = {
     foo : "hello",
};
const obj = {
    foo : "world",
    find(){
         console.log(this.foo)
    },
    finds(){
         console.log(super.foo)
     }
}
Object.setPrototypeOf(obj,proto) // 将obj的prototype改为proto
obj.find() // world
obj.finds() // hello


// 关于super和this的指向
const proto = {
     x : "hello",
     foo (){
         console.log(this.x);
     },
};
const obj = {
     x : "world",
     foo(){
         super.foo();
     },
 };
Object.setPrototypeOf(obj,proto);
obj.foo();  //world
```
> JavaScript引擎内部，super.foo等同于Object.getPrototypeOf(this).foo(属性) 或Object.getPrototypeOf(this).foo.call(this)（方法）。
> 第二段代码中，super.foo指向原型对象proto的foo方法，但是绑定的this却还是当前对象boj，因此输出的就是world。


