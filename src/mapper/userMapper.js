import {User} from "../entity/user.js";
import {dbMain} from "./dbMain.js";
import {BaseMapper} from "./baseMapper.js";

class UserMapper extends BaseMapper {
    constructor() {
        super();
        // this.registerMapField('id2', 'id')
    }

    selectUser(id, password) {
        this.assertArgs(arguments)

        let sql = `select * from user_info where `
        sql += `id=${id} `
        sql += `and password='${password}'`
        return dbMain.Exec(sql).then((data) => {
            return this.doParse(data, User)
        }) /*返回 promise 对象*/
    }

    /*用于修改账号密码*/
    updateUser(id, password, email) {
        this.assertArgs(arguments)

        let sql = `update user_info set id=${id},password='${password}',email='${email}' where id=${id}`
        return dbMain.Exec(sql)
    }
}

export const userMapper = new UserMapper()