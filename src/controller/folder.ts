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