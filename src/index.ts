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
