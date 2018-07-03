let arr = []
let filter = arr.filter
let forEach = arr.forEach
let getElementsByTagName = function (dom, selector) {
  let tag = selector.shift(1)
  let results
  if (/^\..*$/.test(tag)) {
    tag = tag.replace(/^\./, '')
    results = dom.getElementsByClassName(tag)
  } else if (/^#.*$/.test(tag)) {
    tag = tag.replace(/^#/, '')
    results = [dom.getElementById(tag)]
  } else {
    results = dom.getElementsByTagName(tag)
  }
  if (selector.length === 0) {
    return results
  }
  return getElementsByTagName(results[0], selector)
}

class FQuery {
  constructor (selector, isArray) {
    let results
    if (isArray) {
      this.results = selector
    } else if (typeof selector === 'string') {
      if (selector[ 0 ] === '<' &&
        selector[ selector.length - 1 ] === '>' &&
        selector.length >= 3) {
        let div = document.createElement('div')
        div.innerHTML = selector
        results = [div.childNodes[0]]
      } else {
        let arr = selector.split(' ')
        results = getElementsByTagName(document, arr)
      }
      this.results = results
    } else if (typeof selector === 'object') {
      this.results = [selector]
    } else if (!selector) {
      this.results = []
    }
  }
  get isNotEmpty () {
    return this.results.length > 0
  }
  empty () {
    this.results[0].innerHTML = ''
  }
  remove () {
    this.results.length > 0 && this.results[0].remove()
  }
  text () {
    return this.results.length > 0 ? this.results[0].textContent : ''
  }
  each (fn) {
    let len = this.results.length
    for (let i = len - 1; i >= 0; i--) {
      fn(this.results[i], i)
    }
  }
  forEach (fn) {
    forEach.call(this.results, (value, index) => fn(value, index))
  }
  findClass (value) {
    let results = this.results[0].getElementsByClassName(value)
    return new FQuery(results, true)
  }
  findAttribute (key, value) {
    let results = filter.call(this.results, (item) => {
      return item.getAttribute(key).includes(value)
    })
    return new FQuery(results, true)
  }
  append (dom) {
    if (dom instanceof FQuery) {
      if (this.results[0].append) {
        this.results[0].append(dom.results[0])
      } else {
        this.results[0].appendChild(dom.results[0])
      }
    } else {
      let temp = this.results[0].innerHTML
      this.results[0].innerHTML = temp + dom
    }
    return this
  }
  addClass (name) {
    if (this.results.length <= 0) {
      return this
    }
    let temp = this.results[0].className
    this.results[0].className = temp + ' ' + name
    return this
  }
  attr (key, value) {
    this.results[0].setAttribute(key, value)
    return this
  }
  insertBefore (dom) {
    dom.results[0].parentElement.insertBefore(this.results[0], dom.results[0])
    return this
  }
  hasClass (name) {
    let temp = (this.results.length > 0 && this.results[0].className) ? this.results[0].className.split(' ') : ''
    return temp.includes(name)
  }
  eq (value) {
    return this.results[value]
  }
  removeClass (cls) {
    forEach.call(this.results, (obj, index) => {
      let objClass = ' ' + obj.className + ' '// 获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
      objClass = objClass.replace(/(\s+)/gi, ' ')// 将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
      let removed = objClass.replace(' ' + cls + ' ', ' ')// 在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
      removed = removed.replace(/(^\s+)|(\s+$)/g, '')// 去掉首尾空格. ex) 'bcd ' -> 'bcd'
      obj.className = removed// 替换原来的 class.
    })
  }
  find (value) {
    let results = this.results[0].getElementsByTagName(value)
    return new FQuery(...results)
  }
  hide () {
    if (this.results.length > 0) {
      this.results[0].style.display = 'none'
    }
  }
  width () {
    return this.results[0].offsetWidth
  }
  height () {
    return this.results[0].offsetHeight
  }
}

export default FQuery
