[源码地址](https://github.com/shenjipo/blog)

[博客地址](http://101.133.143.249/Blog/#/MainPage/BlogUpdate/5f35a915-01f0-4fe3-989f-6f6bcf4712b0)

## 背景

在[如何搭建并且部署一个自己的博客](http://101.133.143.249/Blog/#/Preview/PreviewBlog/997d5b4b-4e2a-43e5-b9ef-7eff375a1278)文章里，介绍了第一版的博客技术体系，但是在使用的过程中逐步发现一些问题，

1. 由于使用的是云服务器，在切换不同厂商的服务器之间迁移需要配置很多开发环境，例如nginx、node、mysql等，而且可能由于linux版本不同造成兼容性问题，这浪费我们大量时间在配置环境上。
2. 前后端仓库分离使得开发的时候需要来回切换前后端项目，且后端使用js，前端使用ts，后端开发时缺少类型校验与提示，且前后端无法使用抽象出来的一些共有的`模型`，降低开发效率

## 博客技术栈

前端：`vue3` `ts` `pinia` `vue-router` `vditor` `element-plus`

后端：`express` `ts` `jsonwebtoken` `multer` `mysql`

打包：`vite` `pnpm workspace` `rimraf` `dotenv`

部署：`docker` `docker-compose`

![image_eb18c628db362f1532334905b00ede46.png](http://101.133.143.249/api/getImage/image_eb18c628db362f1532334905b00ede46.png)

博客的架构如图所示，最终产物是三个镜像，后端node服务镜像、前端nginx镜像与mysql镜像。基于docker-compose与这三个镜像编排生成容器实例，并且组成一个`app-network`的容器网络，这个容器网络有以下一些特点和功能

* 为了用户能访问到前端静态资源，nginx容器的80端口映射到了虚拟机的80端口
* 为了方便远程查看数据库与转移数据，mysql容器的3306端口映射到了虚拟机的3306端口
* node可以根据容器名称去连接mysql获取数据，nginx容器可以根据容器名称转发前端网络请求到node容器
* 为了持久化存储博客生成的图片，node容器的图片文件夹被映射到虚拟机的`/opt/blog/data/assets`文件夹
* 为了持久化存储博客生成的mysql数据，mysql容器的图片文件夹被映射到虚拟机的`/opt/blog/data/mysql`文件夹

## 基于monorepo仓库实现前后端公用一个model

在[elemen-plus源码解读](http://101.133.143.249/Blog/#/Preview/PreviewBlog/748549b5-dcce-4b09-a855-f4c1b5cbd74c)介绍了基于pnpm的monorepo仓库，尤其是当前后端使用了相同的开发语言时，使用monorepo仓库能够复用部分依赖与模型，下面介绍下本博客的文件目录结构

![image_cb15fb81966fce7ff4ef1230cd0bb830.png](http://101.133.143.249/api/getImage/image_cb15fb81966fce7ff4ef1230cd0bb830.png)

目录中主要包含以下几个重要的文件夹

* `wang-blog-client`前端源码
* `wang-blog-server`后端源码
* `makefile`预先定义好了一些编译打包命令，通过在命令行执行`make run`命令，在通过数字键选择，可以快速的执行命令，参考了开源项目`api-table`
* `pnpm-workspace.yaml`多仓库配置文件，告诉pnpm，把其中指定的每个文件夹当作一个子package，每个子package都有自己的package.json文件，在执行`pnpm -F XXX npm run dev`命令或者`pnpm --filter XXX npm run dev`时，会读取xxx文件夹的package.json文件，并且在xxx文件夹下执行`npm run dev`命令
* `blog`本项目的最终产物，包含了三个镜像、数据库脚本、数据映射的文件夹、容器编排脚本

下面介绍如何实现在后端的项目中，使用前端文件夹中定义的model？

1. 在后端项目中执行 `pnpm add wang-blog-client`添加前端工程（名字取前端pakcage.json部分定义的name）作为自己的依赖，结果如下图所示

![image_31d0782ae98fd92191fef827639a912b.png](http://101.133.143.249/api/getImage/image_31d0782ae98fd92191fef827639a912b.png)

2. 在前端项目中导出某个ts定义的model，例如在`wang-blog-client\src\model\Blog.ts`文件夹下定义的

```typescript
export interface Blog {
    content: string,
    title: string,
    author: string,
    id: string,
    updateTime: string,
    createTime?: string,
    isPreviewShow: string
}
```

3. 在后端的某个文件夹`wang-blog-server\src\api\Blog.ts`下导入，导入的路径如下

```typescript
import type { Blog } from 'wang-blog-client/src/model/Blog'
```

至此就完成了前后端model与依赖的复用

注意，在最终我们会把后端的ts文件编译成为js文件，然后把生成的js格式的文件（不包含第三方依赖）打包到node镜像，而且在node应用启动之前需要重新安装第三方依赖，由于在node容器中只有独立的后端应用，因此在使用npm i安装依赖时，会无法识别wang-blog-client这个依赖

**解决方案是在制作node镜像时，需要提前手动删除pakage.json文件夹中的`"wang-blog-client": "workspace:^"`**

## docker镜像的制作与使用

在本项目使用`docker`与`docker-compose`工具部署时会遇到以下两个问题

1. 如何持久化存储数据库的数据和用户上传的图片？
2. 为了安全，我不想暴漏云服务器除了80和443以外的端口，那么如何将请求转发到后端服务？

对于第一个问题，docker本身就提供解决方案，使用volumes把虚拟机上的某个文件夹映射到容器的文件夹，例如把本地的/data/mysql文件夹映射到容器的var/lib/mysql文件夹

```yaml
volumes:
  - ./data/mysql:/var/lib/mysql
  - ./db-init-scripts:/docker-entrypoint-initdb.d/
```

对于第二个问题，docker-compose给出了解决方案，容器组网络，把nginx、node、mysql三个容器都加入一个`app-network`网络，然后使用services的名称作为域名来连接，

例如后端连接mysql

```javascript
const mysqlInstance = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 3306,
        database: process.env.DB_NAME
    })
```

![image_d2c9a29f4d56eca44e8a5f61978777de.png](http://101.133.143.249/api/getImage/image_d2c9a29f4d56eca44e8a5f61978777de.png)

前端请求后端数据，使用ng转发到后端容器，注意域名填`backend`，对应docker-compose中后端的名称

```
location /api/ {  
    proxy_pass http://backend:3000/api/;   
    proxy_set_header Host $host;  
    proxy_set_header X-Real-IP $remote_addr;  
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
    proxy_set_header X-Forwarded-Proto $scheme;  

    add_header 'Access-Control-Allow-Origin' '*';  
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';  
}
```

![image_a5055992348e316f6757323ac9116c2c.png](http://101.133.143.249/api/getImage/image_a5055992348e316f6757323ac9116c2c.png)

至此，解决了容器部署带来的两个问题，下面时制作镜像与tar包的一些命令

### nginx镜像

> docker build -f Dockerfile.nginx -t blog-nginx:latest .

### mysql镜像

> docker build -f Dockerfile.mysql -t blog-mysql:latest .

### node镜像

> docker build -f Dockerfile.node -t blog-server:latest .

### docker制作镜像与tar包

> docker save -o ./blog/blog-nginx.tar blog-nginx:latest
> docker save -o ./blog/blog-server.tar blog-server:latest
> docker save -o ./blog/blog-mysql.tar blog-mysql:latest

### docker加载tar包作为镜像

> docker load -i blog-nginx.tar
>
> docker load -i blog-server.tar
>
> docker load -i blog-mysql.tar

### docker-compose编排容器与镜像

> docker-compose up 根据配置文件启动容器
>
> docker-compose down 根据配置文件关闭容器

## 基于makefile脚本简化打包部署流程

参考源码makefile文件夹