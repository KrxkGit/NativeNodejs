import http from "node:http";
import {myHandler} from "../app.js";
import {serverConfig} from "../src/config/serverConfig.js";
import {dbMain} from "../src/mapper/dbMain.js";

const serverPort = serverConfig.port
const server = http.createServer(myHandler)

server.listen(serverPort, () => {
    dbMain.Init()
    console.log(`服务器启动，监听端口: ${serverPort}`)
})


/*监听 SIGINT 终止信号 */
process.on('SIGINT', () => {
    console.log('收到退出指令')
    server.close()
})

server.on('close', () => {
    dbMain.Destroy()
    console.log('服务器终止')
    process.exit()
})