/**
 * node nginx.js      启动nginx容器
 * add.conf           是你写自己代理的地方
 * node nginx.js stop 是关闭刚开启的容器代码
 */


var fs = require('fs')
var exec = require('child_process').exec;

//启动函数
function start(){
    //如果参数带了stop 也就是 node nginx.js stop
    var arg = process.argv.splice(2)[0];
    if( arg && arg === 'stop'){
        let stopCmd = `docker kill mynginx`
        exec(stopCmd, function callback(error, stdout, stderr) {
            console.log(stdout);
        });
        return;
    }

    //增加你的配置文件
    let data = createConf( './add.conf' )
    //将配置的nginx文件写入test
    //将test文件映射到容器的/etc/nginx/conf.d/default.conf文件
    //将当前目录的html映射到容器的html
    fs.writeFile( 'test.conf', data,function( err, data ){
        if( err ){
            console.log( err )
        }else{
            cmd = `
                docker container run \
                --rm \
                --name mynginx \
                --volume "${__dirname}":/usr/share/nginx/html \
                --volume "${__dirname}/test.conf":/etc/nginx/conf.d/default.conf \
                -p 127.0.0.1:8080:80 \
                -d \
                nginx
            `
            exec(cmd, function callback(error, stdout, stderr) {
                console.log(stdout);
            });
        }
    });
}

//生成需要的nginx配置文件，
//其中add.conf是你需要代理的路径
/**
 * 例子：将所有ws开头的全部转发到http://172.24.4.221:30010这台服务器
 * location ^/ws~* {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://172.24.4.221:30010/;
    proxy_redirect off;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
 */
function createConf( path ){
    var data = fs.readFileSync( path, 'utf-8').toString();
    let  str = `
        server {
            listen       80;
            server_name  localhost;

            #charset koi8-r;
            #access_log  /var/log/nginx/host.access.log  main;

            location / {
                root   /usr/share/nginx/html;
                index  index.html index.htm;
            }

            ${data}

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

            # proxy the PHP scripts to Apache listening on 127.0.0.1:80
            #
            #location ~ \.php$ {
            #    proxy_pass   http://127.0.0.1;
            #}

            # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
            #
            #location ~ \.php$ {
            #    root           html;
            #    fastcgi_pass   127.0.0.1:9000;
            #    fastcgi_index  index.php;
            #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
            #    include        fastcgi_params;
            #}

            # deny access to .htaccess files, if Apache's document root
            # concurs with nginx's one
            #
            #location ~ /\.ht {
            #    deny  all;
            #}
        }`
    return str;
} 

start()
