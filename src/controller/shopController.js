import {BaseController} from "./baseController.js";
import {shopMapper} from "../mapper/shopMapper.js";

class ShopController extends BaseController {
    constructor() {
        super()
        this.shopMapper = shopMapper
    }

    before(req, res) {
        res.setHeader('Content-Type', 'application/json;charset=utf8')
    }

    doGet(req, res) {
        console.log(req.query)
        const query = req.query
        this.shopMapper.selectShop(query['shop_id'], query['password']).then((shop) => {
            res.end(JSON.stringify(shop))
        })
    }

    doPost(req, res) {
        this.helpDoPost(req, (postData) => {
            this.shopMapper.updateShop(postData['shop_id'], postData['password'], postData['email'])
                .then((data) => {
                    console.log(data)
                    if (data['affectedRows'] > 0) {
                        res.end('更新成功')
                    } else {
                        res.end('无修改')
                    }
                    console.log((JSON.stringify(data)))
                })
        })
    }

}

const shopController = new ShopController()

export {shopController}