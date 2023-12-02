import { initMixin } from "./init"
// 构造方法进行定义vue类会更好
function Vue(options) { // options就是用户的选项
    // 初始化配置项
    this._init(options)
}

// 将_init方法进行配置到Vue原型上
initMixin(Vue)

export default Vue