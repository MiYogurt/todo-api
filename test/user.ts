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