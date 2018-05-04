# 跨域问题解决方案

## JSONP

> ajax 请求受同源策略影响，不允许进行跨域请求，而 script 标签 src 属性中的链接却可以访问跨域的 js 脚本，利用这个特性，服务端不再返回 JSON 格式的数据，而是返回一段调用某个函数的 js 代码，在 src 中进行了调用，这样实现了跨域。JSONP 只能用于 get 请求。

**实现：前端为 127.0.0.1:8080 服务端为 127.0.0.1::8686**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>JSONP</title>
</head>

<body>
    <script src="/jquery.min.js"></script>
    <script>
        function callback(response) {
            console.log(response); // 结果输出：Hello word
        }

        $.ajax({
            type: "get",
            url: "http://127.0.0.1:8686/test",
            dataType: "jsonp",
            success: function (response) {
                console.log(response); // 结果输出：Hello word
            }
        });
    </script>
    <script src="http://127.0.0.1:8686/test?callback=callback"></script>
</body>

</html>
```

```js
var express = require("express");
var app = express();

app.get("/test", function(req, res) {
  var callback = req.query.callback;
  res.send(callback + "('Hello World')");
});

app.listen(8686);
```

## CORS

> CORS(Cross-Origin Resource Sharing, 跨源资源共享)是 W3C 出的一个标准，其思想是使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败。因此，要想实现 CORS 进行跨域，需要服务器进行一些设置，同时前端也需要做一些配置和分析。

* Access-Control-Allow-Origin 表示允许跨域的域名，可以设置为*也可以设置为具体的域，其中，*表示全部，即所有的域名下的请求都允许，但设置为\*后，所有的请求都不会携带附带身份凭证(比如 cookie)；设置为具体的域则表示只有该域下的请求允许，别的域下的请求不被允许，设置为具体的域是请求中携带身份凭证的基础。
* Access-Control-Expose-Headers 表示允许脚本访问的返回头，请求成功后，脚本可以在 XMLHttpRequest 中访问这些头的信息。
* Access-Control-Max-Age 用来指定本次预检请求的有效期，单位为秒。
* ccess-Control-Allow-Credentials 为服务端标识浏览器请求 CORS 时是否可以附带身份凭证，对于附带身份凭证的请求，服务器不得设置 Access-Control-Allow-Origin 的值为“\*”。
* Access-Control-Allow-Methods 用来设置检查网络请求的方式，如 GET、POST 等。
* Access-Control-Request-Headers 用来将实际请求所携带的首部字段告诉服务器，在这里可以自定义头部信息，用来对浏览器的非简单请求进行预检判断。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CORS</title>
</head>

<body>
    <script src="/jquery.min.js"></script>
    <script>
        $.ajax({
            type: "get",
            url: "http://127.0.0.1:8686/test",
            dataType: "json",
            success: function (response) {
                console.log(response);
            }
        });
    </script>
</body>

</html>
```

```js
var express = require("express");
var app = express();

app.get("/test", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  res.send({ a: 123 });
});

app.listen(8686);
```

## iframe 之间相互通信 postMessage

> postMessage() 方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

> 第一个参数就是你要像另外一个窗口传递的数据（只能传字符串类型），第二个参数表示目标窗口的源，协议+主机+端口号，是为了安全考虑，如果设置为“\*”，则表示可以传递给任意窗口。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>a.html  127.0.0.1:8080</title>
    <script>
        window.addEventListener("message", function (event) {
            console.log(event.data); // 输出：我是数据
        });
    </script>
</head>

<body>
    <iframe src="http://127.0.0.1:8686/IFRAME/b.html"></iframe>
</body>

</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>b.html 127.0.0.1:8686</title>
</head>

<body>
    <script>
        window.parent.postMessage("我是数据", "http://127.0.0.1:8080")
    </script>
</body>

</html>
```
