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