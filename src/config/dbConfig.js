// import secret from '../../secret.json' assert { type: 'json'}  /* import 能自动转换json，该功能目前非稳定版故暂不使用 */
import fs from "node:fs";

const secret = JSON.parse(fs.readFileSync('secret.json', 'utf8'))
const dbConfig = {
    host: 'localhost',
    port: 3306,
    database: secret["dbSchema"],
    user: secret["dbUser"],
    password: secret["dbPassword"],
}

export {dbConfig};