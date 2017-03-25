# Todo for typescript and koa

## 搭建项目开发环境

### 初始化环境

* 通过命令 `mkdir todo` 创建我们的文件夹
* 通过命令 `tsc --init` 初始化 typescript 环境。（前提你已经全局安装typescript）
* 通过命令 `npm init -y` 初始化 package.json，保存项目所有依赖项。

> Tip：安装 TypeScript 可以通过 npm i -g typescript 进行安装。

### 安装依赖项

以`@types`开头的都是代码提示文件，也就是说这类依赖只是提供代码提示功能。

```bash
npm i koa -S
npm i @types/koa @types/node -D
```

### 配置 tsconfig.json 
配置输出文件夹，且使其支持 async/await 特性。

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": false,
        "outDir": "dist",
        "lib": [
            "es6",
            "es7"
        ]
    }
}
```

### 创建 src/index.ts 文件

此时你应该可以愉快的看到代码提示。

```ts
import * as Koa from 'koa';

const app = new Koa();

app.use(async ctx => {
    ctx.body = "Todo App";
});

app.listen(3000, () => {
    console.log("Server Stared on http://localhost:3000")
})
```

由于兼容的问题，请注意 `import * as Koa from 'koa'` 会被转换为 `var Koa = require('koa')`。  

而 `import Koa from 'koa'`  会被转换为 `var Koa = require('koa').default`.

为了让它跑起来，我们先在命令行里面输入

```
tsc
```
当编译完成之后，我们应该可以看到一个 dist 文件夹。

### 增加 start 脚本

打开我们的 `package.json` 文件。在里面添加启动脚本。

```
"start": "node dist/index.js"
```

再在命令行里面运行

```bash
npm start
```

打开 localhost:3000 即可看到页面。

> 小提示： 在终端里面按住 Ctrl 点击 URL 是可以通过默认浏览器打开的。

### 难道每次写完代码我都需要重启服务器？
为了解决这个问题，我们需要 pm2 这个工具，这是一个部署 node 服务器的工具，能够实现自动重启。

首先全局安装 pm2

```
npm i -g pm2
```

> 此时你应该把你编辑器的自动保存给关掉

在 package.json 里面添加一些脚本

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "tsc": "tsc --watch",
    "start": "pm2 start dist/index.js --watch dist"
  },
```
此时我们需要启动俩个控制台，先运行 `tsc` 命令，之后在运行 `start`.

```
npm run tsc
npm run start
```

启动`start`命令之后，这个容器会在后台运行。

通过 `pm2 list`， 可以查看所有的容器运行情况，以及容器的ID。
通过 `pm2 stop <容器id>` 可以关闭运行的容器。
通过 `pm2 log <容器id>` 可以查看容器运行的日志，`Ctrl+C` 退出

此时修改我们的文件。然后再回到网页，刷新就可以看到变化。

## 安装 body 解析插件
koa 仅仅只提供最简单的功能，而不提供请求的body解析，所以我们需要一个解析body的插件。
所有的插件我们都可以在[这里](https://github.com/koajs/koa/wiki)找到。

```
npm install koa-better-body -S
```

我们自己来写代码提示文件，在 node_modules/@types 目录下面新建 `koa-better-body` 文件夹，再在里面新建 `index.d.ts`。

> 我为什么要把这个文件写在@types目录下，而不是在 tsconfig.json 里面重新增加一个 typeRoots 路径，是因为只有在@types目录下面才会被解析成模块。

假如我们不知道怎么写，我们首先安装一个同类型的插件，仿照着写。

```
npm i koa-bodyparser -D
```

这样我们就可以仿照 koa-bodyparser 的代码提示文件写了。

插件的配置项具体是什么类型，在[这里](https://github.com/tunnckoCore/koa-better-body)可以找到。

完成的文件如下
```
import *　as Koa from 'koa';
import * as formidable from 'formidable';

declare module "koa"{
    interface Request {
        body: any,
        files: any,
        fields: any
    }
}

declare function bodyParser(opts? : {
    fields?: boolean | string,
    files?: boolean | string,
    multipart?: boolean,
    textLimit?: string,
    formLimit?: string,
    urlencodedLimit?: string,
    jsonLimit?: string,
    bufferLimit?: string,
    jsonStrict?: boolean,
    detectJSON?: () => any,
    strict?: boolean,
    onerror?: () => any,
    extendTypes?: Object,
    IncomingForm?: formidable.IncomingForm,
    handler?: GeneratorFunction,
    querystring?: Object,
    qs?: Object,
    delimiter?: string,
    sep?: string,
    buffer?: boolean
}): Koa.Middleware;

declare namespace bodyParser {}

export = bodyParser;
```


## 安装路由插件

```
npm install koa-better-router -S
```

以同样的方式，我们创建`@types/koa-better-router/index.d.ts`。

```
npm i @types/koa-router -D
```

我们可以仿照 koa-router 写，当然我们前提已经看完了 koa-better-router README.md 的 API。

```
import * as Koa from 'koa';

declare class Router{
    routes: Array<any>;
    get(path: string, fn: (ctx: Router.IRouteContext, next: () => Promise<any>) => any) : any;
    post(path: string, fn: (ctx: Router.IRouteContext, next: () => Promise<any>) => any): any;
    put(path: string, fn: (ctx: Router.IRouteContext, next: () => Promise<any>) => any): any;
    del(path: string, fn: (ctx: Router.IRouteContext, next: () => Promise<any>) => any): any;
    loadMethods() : Router;
    createRoute(method: string, path: string | Function,fn?: any, ...args: Function[]) : Object;
    addRoute(method: string, path: string | Function,fn?: any, ...args: Function[]) : Object;
    getRoute(method: string, path: string | Function, fn?: any, ...args: Function[]) : Object;
    addRoutes(...fn: Array<any>) : Router;
    getRoutes() : any[];
    groupRoutes(dest: any, src1: any, src2: any) : any;
    extend(router: Object): Router;
    middleware(): Koa.Middleware;
    legacyMiddleware(): GeneratorFunction;
}

declare module "koa"{
    interface Context {
        params: any
    }
}

declare namespace Router{
    export interface IRouteContext extends Koa.Context{
        route: any
    }

    export interface IOptions {
        notFound?: (ctx: IRouteContext, next: () => Promise<any> ) => any;
        prefix?: string
    }
}


declare function RouterFactory(opts? : Router.IOptions) : Router;

declare namespace RouterFactory {}

export = RouterFactory
```

## Convert
当我们使用此刻的这些插件的时候，可能会抛出一个警告，所以我们需要 koa-convert 这个工具。

```
npm i koa-convert -S
```

此时修改我们的 `index.ts`

```
import * as Koa from 'koa';
import * as bodyParser from 'koa-better-body';
import * as Router from 'koa-better-router';
import * as Convert from 'koa-convert';

const router = Router().loadMethods();

const app = new Koa();

router.get('/hello', async (ctx, next) => {
  ctx.body = `Hello world! Prefix: ${ctx.route.prefix}`
  await next()
});

router.get('/foobar', async (ctx, next) => {
  ctx.body = `Foo Bar Baz! ${ctx.route.prefix}`
  await next()
})

const api = Router({ prefix: '/api' })
api.extend(router)

app.use(Convert(bodyParser()));
app.use(router.middleware());
app.use(api.middleware());

app.listen(3000, () => {
    console.log("Server Stared on http://localhost:3000")
});
```

运行起来，看一看。

## koa-better-body 在新版本中并不提供body解析功能

新版本仅仅只提供文件，表单，或者Ajax JSON的请求解析，而且从 koa-better-router 的不支持参数匹配来看，这2个插件配合起来更适合做 restful api 。假如我们要解析url上面的参数，所以我们还需要自己再弄一个body解析的插件。

```
npm i koa-bodyparser@2 -S
```

```
npm i @types/koa-bodyparser -D
```

再次修改我们的 index.ts，这里我们选择老的版本是因为我当前的node是6.9，而且typescript并不支持将引入的模块也进行编译降级处理，除非我们用webpack或者其他的打包工具，这里为了简单就直接使用老一点的版本。

```
import * as Koa from 'koa';
import * as OtherParser from 'koa-better-body';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-better-router';
import * as Convert from 'koa-convert';

const router = Router().loadMethods();

const app = new Koa();

router.get('/hello', async (ctx, next) => {
 console.log(ctx.request.body);
  ctx.body = `Hello world! Prefix: ${ctx.route.prefix}`
  await next()
});

router.post('/upload/:id', async (ctx, next) => {
    console.log(ctx.request.files)
    console.log(ctx.request.fields)

    // there's no `.body` when `multipart`,
    // `urlencoded` or `json` request
    console.log(ctx.request.body);
    // print it to the API requester
    ctx.body = JSON.stringify({
        fields: ctx.request.fields,
        files: ctx.request.files,
        body: ctx.request.body || null
    }, null, 2)
    await next();
})

router.get('/foobar', async (ctx, next) => {
  ctx.body = `Foo Bar Baz! ${ctx.route.prefix}`
  await next()
})

const api = Router({ prefix: '/api' })
api.extend(router)

app.use(Convert(bodyParser()));
app.use(Convert(OtherParser()));
app.use(router.middleware());
app.use(api.middleware());

app.listen(3000, () => {
    console.log("Server Stared on http://localhost:3000")
});
```

> 当然我们后面可能并不会用到 body，这里仅仅只是把这个坑提一下，其实我们手动解析一下也非常简单，使用 ctx.querystring，通过 split 就可以直接拿到。

```js
let str = 'a=2&b=3'

let arr = str.split('&')

arr.reduce((prev,i) => (prev[i.split('=')[0]] = i.split('=')[1], prev),{})

// { a: 2, b: 3}
```

## 数据库
为了简单的模拟数据库行为，我们使用最小的数据库 sqlite3，下载 sqlite3 直接到官网的 download 页面，注意，假如您是 win 请下载 `sqlite-tools-win32-x86-3170000.zip`，假如您是其他操作系统，相信您应该具有分辨下载哪一个的能力。

然后把解压好的东西放在你的系统环境变量PATH 里面，我为了简便，我直接丢在了 Python2.7 的目录下面。

在终端里面输入 sqlite3 -version 就应该可以看到版本了。

每一个开发者都不应该直接操作SQL，而是把更多的时间专注在业务上面去，所以我们需要ORM，这里我们选择 sequelize。

首先我们安装一些依赖
```
npm i sequelize sqlite3 -S
```

当然安装 sqlite3 是一件非常麻烦的事情，因为我们需要编译 node 附加模块，所以需要 node-gyp 这个工具。
具体请参考 `https://github.com/nodejs/node-gyp`的 REAMDE.md

实在不行可以使用cnpm进行安装。

```
npm i -g cnpm
cnpm i sqlite3
```

以及代码提示文件

```
npm i @types/sequelize -D
```

### 获取 sqlite3 图形化界面管理工具

来到 sqlite studio 官网 `https://sqlitestudio.pl/index.rvt` 下载。

使用方法也比较方便，解压就能用，选择中文简体语言，使用的话对于聪明的您应该无障碍。

在根目录下面创建一个 `storage/db.sqlite3` 的空文件用来当做数据库。

然后用 sqlite studio 打开这个文件。  

添加字段可能不太好找，它在绿色小勾的右边，自增在主键的配置项里面。

首先我们要理清一下关系，一个用户可以有多个 todo 文件夹，一个 todo 文件夹又包括多个 todo。

* 创建 user 表

```
id integer 主键 唯一 自增
usernmae varchar(255) 唯一 非空
email varchar(40) 唯一 非空
password varchar(255) 非空
```

* 创建 todo_folder 表

```
id integer 主键 唯一 自增 
user_id 外键 非空
title text 非空
```

创建 todo 表

```
id integer 主键 唯一 自增
todo_folder_id 外键 非空
text text 非空
completed boolean 默认false
created_at time 
updated_at time
```

## 安装 password-hash 与测试

用来处理用户密码，不存储用户的明文密码，而是存储加密后的。



```
npm i password-hash -S
```

在 src 目录下面创建 db.ts ， 定义模型我们使用define方法， 这些都是有代码提示的。

```
import * as Sequelize from 'sequelize';
import * as ph from 'password-hash';
import { resolve } from 'path';

const sq = new Sequelize('db', null, null,{
    dialect: 'sqlite',
    storage: resolve(__dirname, '../storage/db.sqlite3')
});

var User = sq.define('user', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
     type: Sequelize.STRING
    },
    password: {
     type: Sequelize.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true // Model tableName will be the same as the model name
});

User.create({
    username: 'yugo',
    email: 'belovedyogurt@gmail.com',
    password: ph.generate('123456')
}).then(console.log)
```

首先编译
```
tsc
```

之后再运行

```
node dist/db.js
```

这样我们就可以在数据里面看到我们的数据了。

## 编写 Model 与 ava 测试文件

之前我们是把js文件编译到dist目录下管理，假如我们的test下面的测试文件也跑到dist目录下面的话就感觉很别扭，因为它没有在它该在的位置上，也就是不在其位而谋其政，尽管我们可以通过写2个 tsconfig.json 和 配置 exclude 选项让它们分开编译来解决这个问题，我们还不如就让 js 和 ts 在同一目录下来的简单。

修改我们的 ` db.ts ` 我们让他仅仅只提供数据库连接。

```
import * as Sequelize from 'sequelize';
import { resolve } from 'path';

const sq = new Sequelize('db', null, null,{
    dialect: 'sqlite',
    storage: resolve(__dirname, '../storage/db.sqlite3')
});

export default sq;
```

修改 tsconfig.json

在根目录下面新建一个 types 文件夹，在这里面你可以写你的代码提示文件，但是并不会被转换成模块。

```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "noImplicitAny": false,
        "sourceMap": true,
        "lib": [
            "es6",
            "es7"
        ],
        "typeRoots": [
            "./types"   
        ]
    }
}
```

在 src 目录下面创建 model 文件夹，新建 `todo.ts` 、 `todoFolder.ts`、 `user.ts` 三个文件。

model 下面都是存放我们的模型，通过 hasMany 定义模型之间的关系。

* todo.ts

```
import sq from '../db';
import * as Sequelize from 'sequelize';
import { TodoFolder } from './todoFolder'

const Todo = sq.define<any, any>('todo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.TEXT
    },
    completed: {
        type: Sequelize.BOOLEAN
    },
    'todo_folder_id': {
        type: Sequelize.INTEGER,
        references: {
            model: TodoFolder,
            key: 'id'
        }
    }
},{
    freezeTableName: true // 模型名字与表名相同
});

TodoFolder.hasMany(Todo, { as: 'Todos', foreignKey: 'todo_folder_id' })

export { Todo }
```

* todoFolder.ts

```
import sq from '../db';
import * as Sequelize from 'sequelize';
import {User} from './user';

const TodoFolder = sq.define<any, any>('todo_folder', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.TEXT
    },
   'user_id': {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    timestamps: false, // 关闭时间戳
    freezeTableName: true // 模型名字与表名相同
})

User.hasMany(TodoFolder, { constraints: false, as: 'Folders', foreignKey: 'user_id' });

export { TodoFolder }
```

* user.ts

```
import sq from '../db';
import * as Sequelize from 'sequelize';
import * as ph from "password-hash";

const User = sq.define<any, IUser>('user', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
     type: Sequelize.STRING
    },
    password: {
     type: Sequelize.STRING
    }
}, {
    timestamps: false, // 关闭时间戳
    freezeTableName: true // 模型名字与表名相同
});


interface IUser {
    username: string,
    email: string,
    password: string
}

export default {
    async createUser(user: IUser) {
        return User.create({
            username: user.username,
            email: user.email,
            password: ph.generate(user.password)
        });
    },

    getOne: User.findById,
    
}

export { User }
```


为了确保这些 model 都已经正确可用了，我们需要编写我们的测试文件。

首先全局安装 ava 测试套件

```
npm i ava -g
```

在根目录初始化 ava 套件

```
ava --init
```


在根目录下面创建 `test` 文件夹，在里面新建 `user.ts`

一定不要把异步函数传给闭包，要不然有一些你意想不到的后果。

```
import UserUtil, { User } from '../src/model/user';
import { TodoFolder } from '../src/model/todoFolder';
import { Todo } from '../src/model/todo';

import test from 'ava';
import * as ph from 'password-hash';

// 错误的例子，最后一个 User 死活删除不了。
// async function deleteData(data: any[]){
//     if(data.length == 0) return;
//     data.forEach( async (i) => {
//         await i.destroy();
//     })
// }

async function deleteData(data: any[]){
    if(data.length == 0) return;
    const compose = data.map((i) => {
        return i.destroy();
    });
    await Promise.all(compose);
}

async function destroyAll(){
    // 因为外键依赖的原因，我们需要按顺序删除
    let todos = await Todo.findAll();

    let folders = await TodoFolder.findAll();

    let users = await User.findAll();

    await Promise.all([deleteData(todos), deleteData(folders), deleteData(users)])

    console.log('aleady delete all data\n');
}

async function fackerData(){
    const user = await UserUtil.createUser({
        username: 'yugo',
        email: 'belovedyogurt@gmail.com',
        password: '123456'
    });

    const todoFolder = TodoFolder.build({
        'user_id': user.id,
        title: '生活'
    });

    await todoFolder.save();

    const todo_1 = Todo.build({
        text: '吃大餐！',
        completed: true,
        'todo_folder_id': todoFolder.id
    });

    const todo_2 = Todo.build({
        text: '睡大觉！',
        completed: false,
        'todo_folder_id': todoFolder.id
    });

    await todo_1.save();
    await todo_2.save();

    console.log('facker data finished!\n');
}

test('test user create', async (t) => {

    await destroyAll();
    await fackerData();

    const user = await User.find({
        where: {
            email: 'belovedyogurt@gmail.com'
        }
    });

 
    let folders = await user.getFolders();

    let todos = await folders[0].getTodos();

    t.is(folders[0].title, '生活');

    t.is(todos[0].completed, true);
    t.is(todos[0].text, '吃大餐！');

    t.is(ph.verify('123456', user.password), true)

});
```

每次运行测试之前必须先运行 tsc 编译好，之后再运行 ava 命令。

我们可以修改一下 package.json 的 scripts

```
  "scripts": {
    "test": "tsc && ava",
    "tsc": "tsc --watch",
    "start": "pm2 start src/index.js --watch src"
  },
```

现在我们在根目录下运行

```
ava
```

到现在，我们的 Model 已经基本建立完成了，接下来我们进入业务编写环节。

## 使用 vs code 调试

按 ctrl + shift + d  , 然后点击左上角的小齿轮配置，把下面代码复制进去。

在你的ts代码里面打上断点，点击绿色的小箭头开始调试即可。

这个非常有用，比你使用 console.log 调试快很多。

```
{
    // Use IntelliSense to learn about possible Node.js debug attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
       {
           "type": "node",
           "request": "launch",
           "name": "启动调试",
           "program": "${workspaceRoot}/src/index.js",
           "outFiles": [
               "${workspaceRoot}/src/*.js"
           ],
           "sourceMaps": true
       },
        {
            "type": "node",
            "request": "attach",
            "name": "附加到进程",
            "address": "localhost",
            "port": 5858,
            "outFiles": [],
            "sourceMaps": true
        }
    ]
}
```

## 用户注册

修改 index.ts

```
import * as Koa from 'koa';
import * as OtherParser from 'koa-better-body';
import * as bodyParser from 'koa-bodyparser';
// import * as Router from 'koa-better-router';
import * as Convert from 'koa-convert';
import { api, router } from './router';

const app = new Koa();

app
.use(Convert(bodyParser()))
.use(Convert(OtherParser()))
.use(router.middleware())
.use(api.middleware())
.listen(3000, () => {
    console.log("Server Stared on http://localhost:3000");
    api.getRoutes().forEach((route) => {
         console.log(`${route.method} http://localhost:3000${route.path}`)
    })
});
```

同样在src下面增加 router.ts 用来控制路由

```
import * as Router from 'koa-better-router';
import UserController from './controller/user';
import * as Koa from 'koa';

const router = Router().loadMethods();
const api = Router({ prefix: '/api/v1' });

api.get('/register', UserController.register);
api.post('/register', UserController.register);

// api.addRoute('GET', 'register', UserController.register);

api.extend( router );
export { api, router }
```

在 src 创建controller文件夹，再新建 user.ts

```
import * as Koa from 'koa';
import UserUtil, { User } from '../model/user';

export default {    
    async register(ctx: Koa.Context, next) {
        try{
            const { username, email, password } = ctx.request.fields
            try{
                const user = await UserUtil.createUser({
                    username,
                    email,
                    password
                });
                ctx.body = JSON.stringify(user);
            }catch (e){
                console.error(e);
                ctx.status = 422;
                ctx.body = '[Unprocesable entity] \n验证失败，' + e.errors[0].message;
            }
        }catch(e){
            console.error(e);
            ctx.status = 422;
            ctx.body = '[Unprocesable entity] \n验证失败，必须传递 username/email/password 三个字段';
        }
        await next();
    }
}
```

假如你想测试一下有没有成功，可以用postman测试一下，必须要以formdata的方式传递参数。

## 增加登陆逻辑

controller/user.ts

这里我们提取了一些公共方法出来用来减少代码量，返回的时候不要把密码返回给用户。

JSON.parse(JSON.stringify(user)) 用于深复制，起初我只是简单的 JSON.stringify ，我想当然的认为已经是一个新对象了，结果password就是删除不掉。

```
import * as Koa from 'koa';
import UserUtil, { User } from '../model/user';
import * as ph from 'password-hash';


function getFields(ctx: Koa.Context, next) : [string, string, string]{
    try{
        const { username, email, password } = ctx.request.fields
        return [username, email, password];
    }catch(e){
        console.error(e);
        ctx.status = 422;
        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 username/email/password 三个字段';
    }
}

function exceptPassword(user: any){
    user = JSON.parse(JSON.stringify(user));
    if(user.password) delete user.password;
    return user;
}

export default {    
    async register(ctx: Koa.Context, next) {
        const [username, email, password] = getFields(ctx, next);
        try{
            const user = await UserUtil.createUser({
                username,
                email,
                password
            });
            ctx.body = exceptPassword(user);
        }catch (e){
            console.error(e);
            ctx.status = 422;
            ctx.body = '[Unprocesable entity] \n验证失败，' + e.errors[0].message;
        }
        await next();
    },

    async login(ctx: Koa.Context, next) {
        const [_, email, password] = getFields(ctx, next);
        ctx.status = 400;
        try{
            const db_user = await User.findOne({
                where: {
                    email
                }
            });
            if(ph.verify(password, db_user.password)){
                ctx.status = 200;
                ctx.body = exceptPassword(db_user);
            }else{
                ctx.body = "密码不正确";
            }
        }catch(e){
            ctx.body = e.errors[0].message;
        }

        await next();
    }
}
```


在 router.ts 增加路由

```
api.post('/login',UserController.login);
```


## 增加 Todo 的一些业务

在 controller 下面新建 todo.ts, 为了更加的健壮大家可以自行把 catch 里面的逻辑补完。

```
import * as Koa from 'koa';
import { Todo } from '../model/todo';

export default {
     async create(ctx: Koa.Context, next){
        try {
            const { todo_folder_id, text, completed } = ctx.request.fields;
            let todo = await Todo.create({
                todo_folder_id,
                text,
                completed
            });
            ctx.body = todo;
        } catch (e) {
          console.error(e);
        }

    },

    async edit(ctx: Koa.Context, next){
        try {
            const { text = null, completed = null, todo_folder_id = null } = ctx.request.fields;
            const id = ctx.params.id;
            const todo = await Todo.findOne({
                where: {
                    id
                }
            });

            if(text) todo.text = text;
            if(completed) todo.completed = completed;
            if(todo_folder_id) todo.todo_folder_id = todo_folder_id;
            await todo.save();

            ctx.body = todo;
            
        } catch (error) {
            console.error(error);
        }
    },

    async show(ctx: Koa.Context, next){
        try {
            const id = ctx.params.id
            const todo = await Todo.findOne({
                where: {
                    id
                }
            });
            ctx.body = todo;
        } catch (error) {
            console.error(error)
        }
    },

    async delete(ctx: Koa.Context, next){
        try {
            const id = ctx.params['id'];
            await Todo.destroy({
                where: {
                   id
                }
            });
            ctx.body = "删除成功";
        } catch (error) {
            console.error(error);
        }
    }
}
```

增加路由

```
api.get('/todo/:id', TodoController.show);
api.post('/todo', TodoController.create);
api.put('/todo/:id', TodoController.edit);
api.del('/todo/:id', TodoController.delete);
```

## 增加 folder 业务逻辑

在controller 目录下面新建 folder.ts

```
import { TodoFolder } from '../model/todoFolder'
import * as Koa from 'koa';
import { Todo } from '../model/todo';

function getFields(ctx: Koa.Context, next){
    try {
        const { user_id, title } = ctx.request.fields;
        return [ user_id, title ];
    } catch (e) {
        console.error(e);
        ctx.status = 422;
        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 user_id/title 字段';
    }
}

export default {
    async create(ctx: Koa.Context, next){
        const [ user_id, title ] = getFields(ctx, next);
        try {
            const folder = await TodoFolder.create({
                user_id,
                title
            });
            ctx.body = folder;
        } catch (e) {
            ctx.body = e.errors[0].message;
        }

    },

    async edit(ctx: Koa.Context, next){
        try{
            const id = ctx.params.id;
            const { title } = ctx.request.fields;

            let folder = await TodoFolder.findOne({
                where:{
                    id
                }
            });
            if(title) folder.title = title;
            await folder.save();
            ctx.body = folder;
        }catch (e) {
            console.error(e);
        }
    },

    async show(ctx: Koa.Context, next){
        try {
            const id = ctx.params.id
            const folder = await TodoFolder.findOne({
                where: {
                    id
                }
            });
            ctx.body = folder;
        } catch (error) {
            ctx.status = 422;
            ctx.body = '[Unprocesable entity] \n 验证失败，必须传递 folder_id 字段';
        }
    },
    async delete(ctx: Koa.Context, next){
        try {
            const id = ctx.params.id;

            await Todo.destroy({
                where: {
                    'todo_folder_id': id
                }
            });

            await TodoFolder.destroy({
                where: {
                    id
                }
            });

            ctx.body = "删除成功";
        } catch (error) {
            ctx.status = 422;
            ctx.body = '[Unprocesable entity] \n验证失败，必须传递 folder_id 字段';
        }
    }
}
```

# 增加路由

```
api.get('/folder/:id', FolderController.show);
api.post('/folder', FolderController.create);
api.put('/folder/:id', FolderController.edit);
api.del('/folder/:id', FolderController.delete);
```


## 增加验证逻辑

我们不想要谁都可以访问 todo 、folder 的一些API，至少我们需要用户登陆了才可以访问，这个时候我们需要 JSON Web Token。

json 代表一种格式，web 代表所处的环境，token 代表一段加密好的字符串。

它的流程通常是这样，在没登录之前访问 todo 或者 folder 是不会给你任何数据的，当我们请求 login 或者 register 接口的时候，校验成功了之后
会返回一段token，之后我们去请求 todo 或者 folder的 API，但是在请求之前，我们要在请求头上面加上一个验证字段，而这个字段的值就是我们的token。

当服务器接收到拥有验证字段的请求头部的时候，服务器会校验这个token的有效性，就是先解密后再拿到里面的值，有的是里面还包含一个有效时间的属性，这里我们为了简单，就不添加超时时间字段了。

安装 koa-jwt 、jsonwebtoken

```
npm i koa-jwt@2 jsonwebtoken -S
```

koa-jwt 是服务器用来验证请求头的中间件，当有验证请求头的时候，它会把里面的数据解密了之后放到 ctx.state.user 这个对象里面。

jsonwebtoken 就是用来加密对象的库

修改 index.ts , 增加 koa-jwt 中间件

```
import * as Koa from 'koa';
import * as OtherParser from 'koa-better-body';
import * as bodyParser from 'koa-bodyparser';
import * as Convert from 'koa-convert';
import * as  kjwt from 'koa-jwt';
import { api, router } from './router';

const app = new Koa();

app
.use(Convert(bodyParser()))
.use(Convert(OtherParser()))
.use(kjwt({secret: 'todo-app'}).unless({ path: [/^\/api\/v1\/(login|register)/] }))
.use(router.middleware())
.use(api.middleware())
.use(async (ctx, next) => {
    console.log("state \n");
    console.log(ctx.state);
    await next();
})
.listen(3000, () => {
    console.log("Server Stared on http://localhost:3000");
    api.getRoutes().forEach((route) => {
         console.log(`${route.method} http://localhost:3000${route.path}`)
    })
});
```

修改 controller/user.ts 让他放回 token， 这个token 非常的简单，就是存储了我们的 user 信息。

```
import * as Koa from 'koa';
import UserUtil, { User } from '../model/user';
import * as ph from 'password-hash';
import * as jwt from 'jsonwebtoken';

var secret = 'todo-app';

function getFields(ctx: Koa.Context, next) : [string, string, string]{
    try{
        const { username, email, password } = ctx.request.fields
        return [username, email, password];
    }catch(e){
        console.error(e);
        ctx.status = 422;
        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 username/email/password 三个字段';
    }
}

function exceptPassword(user: any){
    user = JSON.parse(JSON.stringify(user));
    if(user.password) delete user.password;
    return user;
}

export default {    
    async register(ctx: Koa.Context, next) {
        const [username, email, password] = getFields(ctx, next);
        try{
            const user = await UserUtil.createUser({
                username,
                email,
                password
            });
            const ret = exceptPassword(user);
            ctx.body = jwt.sign(ret, secret);
        }catch (e){
            console.error(e);
            ctx.status = 422;
            // ctx.body = '[Unprocesable entity] \n验证失败，' + e.errors[0].message;
        }
        await next();
    },

    async login(ctx: Koa.Context, next) {
        const [_, email, password] = getFields(ctx, next);
        ctx.status = 400;
        try{
            const db_user = await User.findOne({
                where: {
                    email
                }
            });
            if(ph.verify(password, db_user.password)){
                ctx.status = 200;
                const ret = exceptPassword(db_user);
                ctx.body = jwt.sign(ret, secret);
            }else{
                ctx.body = "密码不正确";
            }
        }catch(e){
            console.error(e);
            // ctx.body = e.errors[0].message;
        }

        await next();
    }
}
```

这样我们就保证了不是谁都可以请求我们的 todo 和 folder api 了。