/* 用作基类，定义通用接口 */
import querystring from "node:querystring";

class BaseController {
    /* 定义前置钩与后置钩，由于异步问题，后置钩触发机制难以统一，故不设置 */
    before(req, res) {

    }

    /*    after(req, res) {

        }*/

    /*定义解析 x-www-form-urlencoded 请求体辅助函数*/
    doParseReqBody(req, postData) {
        const contentType = req.headers['content-type']
        if (contentType === 'application/x-www-form-urlencoded') {
            const postBody = querystring.parse(postData)
            return postBody
        } else {
            return null
        }
    }

    /* 定义处理请求方法 */
    doGet(req, res) {

    }

    doPost(req, res) {

    }

    /* 定义处理 x-www-form-urlencoded 辅助函数，封装常用的准备工作 */
    helpDoPost(req, callback) {
        let postData = ''
        req.on('data', (chunk) => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            postData = this.doParseReqBody(req, postData)
            if (postData === null) {
                console.error(`不支持该请求体类型`) /*不建议使用throw new Error方式，因为异步代码无法直接用catch进行捕获*/
            }
            callback(postData)
        })
    }

    doPut(req, res) {

    }

    doDelete(req, res) {

    }
}

export {BaseController}