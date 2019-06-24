## 1.基本概念
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

## 2.new操作符
```javascript
var obj = new Base()

// 真正内部操作

var obj = {}
obj._proto_ = Base.prototype
Base.call(obj) // 将Base构造函数的作用域赋值给obj，this指向

```
