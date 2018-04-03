title: 事件通信
layout: doc
---

MIP 提供了强大的组件DOM通信，组件间通信功能，以解决在[MIP组件开发](https://www.mipengine.org/doc/2-tech/4-mip-widget.html)中遇到的组件交互问题。

## 应用场景：
DOM通信：
	- 点击按钮，弹出层(`<mip-lightbox>`)显示。
	- 点击按钮，展开折叠元素(`<mip-showmore>`)。
组件间通信：
	- 当用户触发筛选(`<mip-filter>`)时，页面返回顶部(`<mip-gototop>`)。

## DOM 点击通信

由于 MIP 不允许使用附加的 JS 代码。所以提供了一套事件 action 机制，可以通过 DOM 属性来触发某个 MIP 元素的自定义事件。

html:
```
<mip-test id="test"></mip-test>

<div on="tap:test.custom_event">不带参数</div>

<div on="tap:test.custom_event(test_button)">带参数</div>

<div on="tap:test.custom_event(test_button) tap:test.custom_event(test_button1)">多个事件</div>
```

JS:
```
// mip-test.js
define(function (require) {
    var customEle = require('customElement').create();
    customEle.prototype.build = function () {
        // 绑定事件，其它元素可通过 on="xxx" 触发
        this.addEventAction("custom_event", function (event/* 对应的事件对象 */, str /* 事件参数 */) {
            console.log(str); // undefined or 'test_button' or 'test_button1'
        });
    };
    return customEle;
});
```
[info] DOM 点击通信可运行示例见 [mip-showmore 示例](https://www.mipengine.org/examples/mip-extensions/mip-showmore.html)。

## 使用 DOM 属性实现组件间通信

示例：当用户触发筛选(`<mip-filter>`)时，页面返回顶部(`<mip-gototop>`)。

html:

```
<-- on="主动通信组件内绑定的可监听事件:被通信组件id.被通信组件暴露出来的方法"-->
<mip-filter on="filt:mygototop01.gototop"></mip-filter>

<mip-fixed type="gototop">
    <mip-gototop id="mygototop01"></mip-gototop>
</mip-fixed>
```

JS:

```
// mip-filter.js 抛出 'filt' 事件，在 DOM 中通过 on 绑定 
define(function (require) {
    var customEle = require('customElement').create();
    var viewer = require('viewer');
    customEle.prototype.firstInviewCallback = function () {
    	this.element.addEventListener('click', function() {
    		filt(); // 筛选逻辑
    		// 触发组件本身的‘filt’事件
			viewer.eventAction.execute('filt', evt.target, evt);
    	});
    };
    return customEle;
});

// mip-gototop.js 定义 'gototop' 事件，方便 eventAction 从外部触发。
define(function (require) {
    var customEle = require('customElement').create();
    var viewer = require('viewer');
    customEle.prototype.firstInviewCallback = function () {
    	addGotoTopEventHandler(); //组件点击事件监听及处理
    	// 定义 gototop 事件，方便 eventAction 从外部触发。
    	this.addEventAction("gototop", function (event/* 对应的事件对象 */, str /* 事件参数 */) {
            pageScrollTop(); //组件内定义的页面回顶操作。
        });
    };
    return customEle;
});
```
