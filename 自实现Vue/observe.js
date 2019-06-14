function Dep () {
  this.subs = []
}
Dep.prototype = {
  addSub: function (val) {
    this.subs.push(val)
  },
  notify: function () {
    this.subs.forEach(function (val, index) { // 当其中一个订阅者发生变化时，通知整个订阅者队列做出update的操作
      val.update()
    }) 
  }
}

var dep = new Dep()

function defineReactive (data, key, value) {
  observer(value)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return value // 这里很重要，不能写成data[key]，不然一直在get函数里！！！！
    },
    set: function (newVal) {
      console.log('数据由' + value + '改变成' + newVal)
      console.log(dep)
      value = newVal
      dep.notify()
    }
  })
}
Dep.target = null

function observer (obj) {
  if (typeof(obj) !== 'object' || !obj) {
    return;
  }
  Object.keys(obj).forEach(function (key, index) {
    defineReactive(obj, key, obj[key])
  })
}

// observer(data)
// export default observer
