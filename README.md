# 🌐Nodejs Webserver Demo

本项目为 Nodejs 练手 Demo 项目，项目实现了一个简单的 HTTP Web 后端服务器。

## 🍺Features

1. 采用 **MVC** 架构设计，封装了 *entity, mapper, controller, config, routes* 层，有利于业务代码的分层实现。
2. 体现了**依赖注入**的设计模式，能完成 SQL 查询结果到 *entity* 对象的自动属性解析。
3. 实现了简单的路由自动派发。
4. 基于**类的继承**方式定义了*http*请求模板接口。
5. 采用了**单例模式**的设计模式，*mapper, controller* 均采用**单例模式**，有利于对象的重用与流程控制。
6. 采用 **npm** 管理项目，可根据不同的环境(如dev与test)运行不同的模式。其中 **dev** 模式采用**nodemon** 运行项目，项目修改保存后能自动**热重启**，有助于加速项目的开发。

## 📖Document

### 📜startup & exit

项目以

> ```
> bin/www.js
> ```

为入口点，实现 *http* 服务器的初始化，退出管理，同时进行数据库连接的管理。本项目采用了一直打开数据库连接的简单处理。

### 📜configuration

项目的配置主要由

> src/config/*

完成，其中

> src/config/dbConfig.js

完成**数据库连接**的配置。



> src/config/routerConfig.js

完成**路由表**的配置。



> src/config/serverConfig

完成服务器参数如**端口号**的配置。

### 📜entity

此层用于设计实体接口。值得注意的是：**不应该为实体定义方法，而只定义实体的属性，否则可能影响 自动实体注入功能**。

### 📜controller

此层定义的控制器都应该**继承**

> BaseController

该类定义了控制器一些通用的接口与辅助函数。更详细的说明如下：

```javascript
before() // http 请求预处理，该方法会自动被调用，无需在自定义的控制器调用
doParseReqBody(req, postData) // 对于 body 为 x-www-form-urlencoded类型的请求，通过该辅助方法可以更方便地解析 body，函数将返回一个包含参数值的字典对象
helpDoPost(req, callback) // 封装了 post 请求的异步处理，post 数据接收完毕后，将调用 callback 指定的后续处理函数

// 最后是定义通用的 RESTFul 接口，子类应改写它们。这些接口会在匹配的路由与请求方法下被自动调用。
doGet()
doPost()
doPut()
doDelete()
```

另外，为了保证路由自动派发能正常工作，控制器应采用**单例模式**并将**控制器对象**与**对应路由**在路由表

> src/config/routerConfig.js

中登记绑定。

### 📜routes

此层将根据

> src/config/routerConfig.js

定义的路由进行自动派发，且根据 请求方法(如GET, POST等)自动调用路由对应的**Controller**的 **do***  方法。值得注意的是：在这之**前**，将自动调用 **Controller.before()**.

### 📜mapper

此层实现关于数据库的操作。

> dbMain.js

实现数据库的连接管理，采用单例模式。另外，该类的

```javascript
SafeSql(sql)
```

方法在执行 sql 查询**前**被**自动**调用，可用于实现*如检查是否存在 sql 注入*等功能，本项目中此函数未加特别处理，可自行修改。另外，该函数的调用时机应**晚于** 自定义 mapper 类的

```javascript
assertArgs(args) // 更方便地对每个参数进行独立判断
```

方法。

若不需要对每个参数进行独立判断，以下是一个例子：

```javascript
class UserMapper extends BaseMapper {
    selectUser(id, password) {
        this.assertArgs(arguments) // 检查参数的合法性

        let sql = `select * from user_info where `
        sql += `id=${id} `
        sql += `and password='${password}'`
        return dbMain.Exec(sql).then((data) => {
            return this.doParse(data, User)
        }) /*返回 promise 对象*/
    }
}
```

而 BaseMapper 定义了一个的 assertArgs 函数的一个例子(基于检查是否存在 *--* 的 sql注释符号，因为这是一种常见的 sql 注入手段 )，可自行修改此函数实现更复杂的检查。

```javascript
export class BaseMapper {
    assertArgs(args) {
        for (const arg of args) {
            if (arg.toString().search('--') !== -1) {
                console.log('存在 SQL 注入')
                return false
            }
        }
        return true
    }
}
```



此外，所有 mapper 类应**继承**

> BaseMapper

该类定义一些辅助函数以方便映射。更详细的说明如下：

```javascript
assertArgs(args) // 检查参数的合法性(如是否存在SQL注入)，子类可进行改写，该方法需要自行调用。
registerMapField(objField, sqlField) // 对应实体属性字段与数据库字段不匹配的情况，通过该方法可注册实体属性字段到数据库字段的映射关系
doParse(sqlRes, outClass) // 对于sql查询的后果，将根据 outClass 指定的类的类型自动解析为 类 对应的实体对象，通过 promise 的方式返回
```

