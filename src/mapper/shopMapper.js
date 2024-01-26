import {BaseMapper} from "./baseMapper.js";
import {dbMain} from "./dbMain.js";
import {Shop} from "../entity/shop.js";

class ShopMapper extends BaseMapper {
    constructor() {
        super();
        this.registerMapField('shopId', 'shop_id')
    }

    selectShop(shop_id, password) {
        this.assertArgs(arguments)

        let sql = `select * from shop_info where `
        sql += `shop_id=${shop_id}`
        sql += ` and password='${password}'`

        return dbMain.Exec(sql).then((data) => {
            return this.doParse(data, Shop)
        })
    }

    /*用于修改账号密码*/
    updateShop(shop_id, password, email) {
        this.assertArgs(arguments)
        let sql = `update shop_info set shop_id=${shop_id}, password='${password}', email='${email}' where shop_id=${shop_id}`
        return dbMain.Exec(sql)
    }
}

const shopMapper = new ShopMapper()

export {shopMapper}