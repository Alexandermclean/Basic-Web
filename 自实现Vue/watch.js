function Watcher (vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.get() // 强行触发get函数，把自己存进订阅者队列(subs)中
  // this.valueObj = {}
  // for (let i=0; i<expList.length; i++) {
  //   this.valueObj[expList[i]] = this.get(expList[i])
  // }
}

Watcher.prototype = {
  update: function () {
    let newValue = this.vm.data[this.exp]
    let oldValue = this.value
    if (newValue !== oldValue) {
      this.value = newValue
      this.cb.call(this.vm, newValue, oldValue) // TODO：这个call不是太懂
    }
  },
  get: function () {
    Dep.target = this
    var value = this.vm.data[this.exp] // 触发data中值的get函数，把Dep.target存进订阅者队列(subs)中
    Dep.target = null // 触发get函数后置空
    return value
  }
}

// export default Watcher
