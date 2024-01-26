import {BaseController} from "./baseController.js";
import {userMapper} from "../mapper/userMapper.js";

class UserController extends BaseController {
    constructor() {
        super()
        this.userMapper = userMapper
    }

    before(req, res) {
        res.setHeader('Content-Type', 'application/json;charset=utf8')
    }

    doGet(req, res) {
        const query = req.query
        this.userMapper.selectUser(query.id, query.password).then((user) => {
            res.end(JSON.stringify(user))
        })
    }

    doPost(req, res) {
        this.helpDoPost(req, (postData) => {
            this.userMapper.updateUser(postData.id, postData.password, postData.email).then((data) => {
                if (data['affectedRows'] > 0) {
                    res.end('更新成功')
                } else {
                    res.end('无修改')
                }
                console.log(JSON.stringify(data))
            })
        })
    }
}

/*单例模式*/
const userController = new UserController()

export {userController}