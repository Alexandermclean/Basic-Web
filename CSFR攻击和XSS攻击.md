在说这两种web攻击方式之前，可以先去了解一下之前我写的cookie、session和token这些客户端和服务端的认证信息概念[链接](https://github.com/Alexandermclean/Security-Cloud-Project#11%E5%9F%BA%E4%BA%8Etoken%E7%9A%84%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81)

## 1.CSFR攻击
CSRF是Cross Site Request Forgery的缩写，翻译过来就是跨站请求伪造：  

1、跨站：顾名思义，就是从一个网站到另一个网站。  

2、请求：即HTTP请求。  

3、伪造：在这里可以理解为仿造、伪装。  

综合起来的意思就是：从一个网站A中发起一个到网站B的请求，而这个请求是经过了伪装的，伪装操作达到的目的就是让请求看起来像是从网站B中发起的，也就是说，让B网站所在的服务器端误以为该请求是从自己网站发起的，而不是从A网站发起的。当然，请求一般都是恶意的，不然也就没必要伪装了= =。  

其实从上述描述来看，是网站A帮网站B发送的恶意请求，按道理来说应该会受到浏览器同源策略的影响而导致请求失败，但是**img、iframe之类的标签不受同源策略的影响**，所以当向网站B发送请求时会将网站A相关的cookie都一并提交上去（会提交哪些cookie需要根据cookie作用域来决定），这样网站B验证cookie后误认为是用户在操作，实际上用户是在无意识下被做了一些操作。
```javascript
恶意网站
 
<html>

<p>这是黑客诱导客户访问的恶意网站地址</p>

<img src = "http://github.com?delete=10">

</html>
```

> 老版的ie，safari是禁止img、iframe标签请求时发送cookie的，但是最新的firefox以及chrome等主流浏览器都是允许的;同源策略是浏览器实现的，只要请求发出浏览器，同源策略和跨域就用不到了！  

### 1.cookie分类
cookie根据有无设置过期时间分为会话cookie和本地cookie两种。  

没有设置过期时间的为Session Cookie（会话cookie），firefoox有标注哪些cookie是会话cookie，这种cookie保存在内存空间中，在浏览器进程的生命周期中都有效，但是一关闭浏览器就被抹除。另外一种设置过期时间的叫做third-party Cookie,也称之为本地cookie，保存在本地，在过期时间内都可以使用。

### 2.CSRF的防御
#### 1.验证码
这种做法就是强迫用户在做操作前交互一次，保证这次操作是用户本人发起的  

#### 2.Referer Check
在http请求头里面有个属性叫referer，这里存储着请求来源的域名。Referer Check最常见的应用就是防止图片盗链，通过查看请求的来源判断请求是否合理，比如通过攻击者的网站A嵌入网站B的地址，那referer就是攻击者网站A的地址，这样很大程度能判断出这是一个CSRF攻击，但是这个方法的缺陷是：**服务器并不是每次都能取到Referer信息。**  

#### 3.构造不可预见性URL
CSRF能够攻击成功，其本质原因是被攻击网站请求的URL被攻击者猜到，如果请求的URL具有不可预测性，那么攻击者也就无从下手。现在最通用的方式就是在URL中加入一个token参数。token可以存在用户的cookie中，服务器也存有该客户对应的token值。因为CSRF攻击只是利用登录cookie，并无法获取cookie的具体值（除非用户还被XSS攻击了，导致cookie泄露，那就无济于事了）。  

token应该同时放在提交表单中与服务器session中，在有效时间之内，只要服务器session没有被使用(即用户没有提交表单，这个需要服务器提供一个方案判断某个session是否已经被使用过)，都使用同一个token，否则需要重新生成token，并保存到表单和session中。

token也应该注意保密性，不应出现在url中，因为这样可以通过referer获取到，一个尽量放在表单中，把敏感的操作由GET改为POST，一form表单或者AJAX的形式提交，可以避免token泄露
