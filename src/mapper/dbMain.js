import mysql from 'mysql2'
import {dbConfig} from "../config/dbConfig.js";

class DbMain {
    connection

    Init() {
        this.connection = mysql.createConnection(dbConfig)
        this.connection.connect()
    }

    Destroy() {
        console.log('关闭连接')
        this.connection.end()
    }

    SafeSql(sql) { /*预处理sql，抵御sql注入*/
        /*预处理代码*/
        return sql
    }

    Exec(sql) {
        sql = this.SafeSql(sql)
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

const dbMain = new DbMain()

/* 单例模式，用于管理数据库连接 */
export {dbMain}