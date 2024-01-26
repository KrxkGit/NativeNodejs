export class BaseMapper {
    constructor() {
        this.reMapping = {}
    }

    registerMapField(objField, sqlField) { /* 注册需要重命名映射的属性 */
        this.reMapping[objField] = sqlField
    }

    doReMap(properties) { /* 根据重命名修正映射, Obj->Sql */
        /* 先拷贝一份，避免修改原属性 */
        /*由于查询返回的属性可能少于实体的属性，故应基于实体属性进行拷贝*/
        const propertiesNew = []
        Object.assign(propertiesNew, properties)
        for (const key in this.reMapping) {
            const index = propertiesNew.indexOf(key)
            propertiesNew[index] = this.reMapping[key]
        }
        return propertiesNew
    }

    /*根据查询结果 映射为 对象*/
    doParse(sqlRes, outClass) {
        return new Promise((resolve, reject) => {
            if (sqlRes.length === 1 && typeof sqlRes === "object") { /* 查询结果是列表，若列表只有单个元素，直接赋值*/
                sqlRes = sqlRes[0]
            }
            const out = new outClass()
            const objProperties = Object.keys(out)
            const sqlProperties = this.doReMap(objProperties)
            // console.log(`${objProperties} ${sqlProperties}`)

            for (let i = 0; i < sqlProperties.length; i++) {
                const propertySQL = sqlProperties[i]
                const propertyObj = objProperties[i]
                if (!sqlRes.hasOwnProperty(propertySQL)) {
                    // reject(`Query result don't contain property: ${propertySQL}`) /*查询结果不包含*/
                    out[propertyObj] = undefined
                } else {
                    out[propertyObj] = sqlRes[propertySQL]
                }
            }
            resolve(out)
        })
    }

    /*分析是否存在 SQL 注入，个性化检查，先于共性检查。
    示例: 调用 this.assertArgs(arguments) */
    assertArgs(args) {
        for (const arg of args) {
            if (arg.toString().search('--') !== -1) {
                console.log('存在 SQL 注入')
                return false
            }
        }
        return true
    }
}