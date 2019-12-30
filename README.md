# kabuto  

基于quicklink的预加载工具。  

## Background
quicklink是Google开源的预加载工具，可以在空闲时间预获取页面可视区域（以下简称视区）内的链接，加快后续加载速度。  
但是在实际应用中quicklink还是有一定问题：  
1.dom监听只能监听a链接下的href资源  
2.对于快速滑动的列表，会出现即使没有再视窗停留也会预加载的情况，出现大量的无效预加载。   
3.对于html文档来说，只能预加载主文档，主文档内的资源无法预加载，对于一些依赖于js渲染的页面来讲，预加载意义不大。  
为了解决这些问题，在quicklink的基础上，封装了kabuto(假面骑士kabuto，可以clock up 加速)。

特点：  
1.增加data-kabuto-link声明，有data-kabuto-link的元素也会被监听。  
2.增加曝光时间设置，只有在视窗内持续曝光的元素会被预加载  
3.增加html页面的资源解析，同时预加载页面和页面静态资源（只限于同域页面）

## Install
```
npm install h-kabuto --save 
or 
yarn add h-kabuto

```

## Usage

初始化后，Kabuto 将自动在闲时预获取视区内的链接 URL。

```javascript 

import Kabuto from 'h-kabuto'

const kabuto = new Kabuto({
    origins:this.origins,
    ignores:this.ignores,
    timeout:this.timeout
});
kabuto.add('http://127.0.0.1:3000/demo/demo.html');
```

## API
kabuto的option参数基本和quick类似,接受带有以下参数的 option 对象（可选）：
* el：指定需要预获取的 DOM 元素视区,默认为document。
* urls：预获取的静态 URL 数组（若此参数非空，则不会检测视区中 document 或 DOM 元素的链接）。
* timeout：整型数，为 requestIdleCallback 设置超时。浏览器必须在此之前进行预获取（以毫秒为单位）， 默认取 2 秒。
* origins: 静态字符串数组，包含允许进行预获取操作的 URL 主机名。默认为同域请求源，可阻止跨域请求。
* ignores: RegExp（正则表达式），Function（函数）或者 Array（数组），用于进一步确定某 URL 是否可被预获取。会在匹配请求源之后执行。
* observeTime:预获取的 DOM 元素视区曝光的时间，只有曝光时间大于的dom才去预获取,默认取 0.5 秒。
* noquery: 是否预加载不同参数的同样链接，默认为true;

详情可参看 https://github.com/GoogleChromeLabs/quicklink/blob/master/translations/zh-cn/README.md

## Methods

kabuto 新增了一些方法

#### add(url)
> 新增预加载的url
```
kabuto.add('http://127.0.0.1:3000/demo/demo.html')
```

#### observe(el) 

> 新增要监听的dom
```
kabuto.observe(document.body)

```

## Notice 

1.对于dom的监听，可以在元素上增加data-kabuto-link属性，有data-kabuto-link的元素也会被监听。  
```
<div data-kabuto-url="https://fed.taobao.org/"></div>
//当前dom曝光是，会尝试预加载https://fed.taobao.org/和页面内的资源
    
``` 
2.对于页面类型的资源，会尝试去解析页面内的静态资源，并预加载，不过由于浏览器限制，该功能仅限于同源页面。

## ChangeLog
*0.1.2*  
1.页面增加图片链接预加载  

*0.1.3*  
1.增加noquery参数，不同参数的同链接，默认不再预加载  



## License
[MIT](https://github.com/hezhengjie/kabuto/blob/master/LICENSE) © hezhengjie




