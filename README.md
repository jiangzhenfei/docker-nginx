# docker-nginx

#### add.conf 这个文件是你需要配置代理，配置非常简单，我也在里面写了几个配置的例子
#### nginx.js 这个文件是启动文件，不需要任何修改

## 启动
```node
node nginx.js 
```
这个时候你只需要 打开http://localhost:8080/ 就能看见你的html页面了
## 如果想关闭整个代理
只需要执行
```node
node nginx.js stop
```
再次访问就访问不到了
