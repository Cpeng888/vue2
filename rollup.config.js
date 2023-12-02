// rollup 默认可以导出一个对象 作为打包的配置文件
import babel from "rollup-plugin-babel"
export default {
    // 入口
    input:"./src/index.js",
    output:{
        file:"./dist/vue.js",
        name: "Vue",
        format:"umd", // esm es6模块 commonjs模块 life只执行函数 umd兼容commonjs和amd
        sourcemap: true // 文件溯源
    },
    plugins:[
        babel({
            exclude:"node_modules/**" // 不打包node_modules
        })
    ]
    
}