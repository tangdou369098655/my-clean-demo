# webpack_clean_2021-5-10

#### 介绍
纯净版本框架webpack+less

#### 软件架构
软件架构说明


#### 安装教程

1.  npm install
2.  npm run dev 
3.  npm run build

#### 使用说明

打包时候去掉注释
进入webpack.config.js
找到下面这行代码，注释掉就可以了
```
  // devtool: 'cheap-module-eval-source-map', //开发环境下使用 打包上线之前要改一下这个哦TODU-LIST

```



.less文件引入图片
```
 background: url('./assets/img/mya.png');
```
JS里引入静态资源文件，便于打包
```
import { staticUrl, ajax } from './tool'
const texture = new THREE.TextureLoader().load(
    staticUrl + 'assets/img/testImg/testpng/' + conf.urlName
  )

  /**
 * 获取数据
 */
function getData() {
  const param = {
    a: 'aaa',
    s: {
      b: 'bbb',
      c: 'D54',
    },
  }
  ajax({
    type: 'POST',
    url: 'http://10.10.10.10:5555/api/abcd',
    // data: param,
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(param),
    dataType: 'json',
    // crossDomain: true,
    success: function (res) {
      // console.log(JSON.stringify(res))
    },
    error: function (a, b, c) {
      console.log('设数据获取失败')
    },
  })
}
``` 

#### 欢迎大家提交代码更新~~~

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


