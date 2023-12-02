(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 重写数组中的七个方法

  var oldArrayProto = Array.prototype; // 获取数组的原型

  // 创建一个以Array.prototype 为原型的 对象
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

  // 重写方法
  methods.forEach(function (method) {
    // 更改新的arr原型方法，但是执行旧的方法
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var res = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用原来的方法，函数的劫持，切片编程
      // 拿到Observe的this
      var ob = this.__ob__;
      // 我们需要对新增的数据再次进行劫持
      var inserted;
      switch (method) {
        case 'push':
        case 'push':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
      }
      // 如果inserted存在 对新增的内容再次进行检测
      if (inserted) {
        ob.obseverArray(inserted);
      }
      return res;
    };
  });

  // 检测类
  var Obsever = /*#__PURE__*/function () {
    function Obsever(data) {
      _classCallCheck(this, Obsever);
      // 给数据添加标识 就是给每个data都添加个__ob__属性，如果有这个属性就说明已经每监测了
      Object.defineProperty(data, '__ob__', {
        value: this,
        // 这样就可以调用Observer的方法
        enumerable: false // 将__ob__变成不可枚举的的属性，如果不添加这个属性就会一直循环递归
      });
      // object.defineProperty只能劫持已经存在的属性（vue里面会维持单独写一些api, $set $delete）
      if (Array.isArray(data)) {
        // 重写方法 七个变异方法
        data.__proto__ = newArrayProto;
        this.obseverArray(data); // 数组中的对象时刻以监控到数据的变化
      } else {
        this.walk(data);
      }
    }
    _createClass(Obsever, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象对属性依次劫持
        // "重新定义" 属性
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
      // 数组单独进行检测
    }, {
      key: "obseverArray",
      value: function obseverArray(data) {
        data.forEach(function (item) {
          return obsever(item);
        });
      }
    }]);
    return Obsever;
  }(); // 数据劫持
  var obsever = function obsever(data) {
    // 对这个对象进行劫持

    // 只能对象进行劫持
    if (_typeof(data) !== "object" || data === null) return;
    // 说明已经被代理过了
    if (data.__ob__ instanceof Obsever) return data.__ob__;
    return new Obsever(data);
  };

  // taget是对象和 key是属性明 value是属性值
  function defineReactive(target, key, value) {
    // value是一个闭包
    // 属性值是对象或者数组也要进行劫持
    obsever(value); // 对所有的对象都进行属性劫持 进行递归
    Object.defineProperty(target, key, {
      // 取值的时候
      get: function get() {
        console.log('我取值了');
        return value;
      },
      // 设置值的时候
      set: function set(newValue) {
        console.log("\u6211\u88AB\u8BBE\u7F6E\u4E86".concat(newValue));
        if (newValue === value) return;
        value = newValue;
        obsever(newValue); // 设置完后也要立即进行检测
      }
    });
  }

  // 挂载_init方法 
  function initMixin(Vue) {
    // 将vue作为参数传进来
    // 初始化options
    Vue.prototype._init = function (options) {
      var vm = this;
      // 建立$options
      vm.$optins = options; // vm.$options 获取用户配置
      // 初始化状态（包括data,props,watch，......）
      initState(vm);
    };
  }
  // 总方法
  function initState(vm) {
    var opts = vm.$optins; // 获取所有选项
    // 初始化data
    if (opts.data) {
      initData(vm);
    }
  }
  // 初始化data
  function initData(vm) {
    var data = vm.$optins.data; // data可能是函数和对象
    // 如果是函数就执行拿到数据 不是就直接拿到
    data = typeof data === "function" ? data.call(this) : data;
    console.log(data);
    // 进行数据劫持 vue2中使用obj.defineproperty
    obsever(data);
    // 赋值给_data
    vm._data = data;
    // 将vm._data进行二次代理
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 将_data的东西代理到vm实例上 啥意思呢 就是 之前是通过vm._data.name获取name,现在是可以通过vm.data获取
  function proxy(vm, targert, key) {
    // 重新定义vm的属性
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[targert][key];
      },
      set: function set(newValue) {
        vm[targert][key] = newValue;
      }
    });
  }

  // 构造方法进行定义vue类会更好
  function Vue(options) {
    // options就是用户的选项
    // 初始化配置项
    this._init(options);
  }

  // 将_init方法进行配置到Vue原型上
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
