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