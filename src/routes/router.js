/* 处理路由*/
import querystring from "node:querystring";
import {routerConfig} from "../config/routerConfig.js";

export function handleRoute(req, res) {
    let splitRes = req.url.split('?')
    /*保存变量用于后续传递*/
    req.route = splitRes[0]
    req.query = querystring.parse(splitRes[1])

    let route = req.route

    /* 查询注册的控制器 */
    let controller = routerConfig[route]
    if (!controller) { /* 没有注册的路由 */
        res.writeHead(404)
        res.end()
        return
    }

    /* 派发请求到控制器，控制器采用单例模式 */
    dispatchController(controller, req, res)
}

function dispatchController(controller, req, res) {
    controller.before(req, res)
    const method = req.method
    /* 根据请求进行调用 */
    switch (method) {
        case 'GET':
            controller.doGet(req, res)
            break
        case 'POST':
            controller.doPost(req, res)
            break
        case 'PUT':
            controller.doPut(req, res)
            break
        case 'DELETE':
            controller.doDelete(req, res)
            break
        default:
            // 不可接受的方法
            res.writeHead(404)
            res.end()
    }
    // controller.after(req, res)
}