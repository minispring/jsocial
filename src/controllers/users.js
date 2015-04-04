var MongoApi = require("../modules/mongoController")
var MongoController = MongoApi.MongoController
var ModelDefault = MongoApi.ModelDefault

var users = new MongoController({
    table:"users",                              //表名
    model:{                                     //模型格式定义
        Default:{                               //默认格式，用于添加新的对象时，增加附加的属性（调用为函数返回结果）
            _id:ModelDefault.id,
            create:ModelDefault.now,
            password:"aaa"
        },
        OutFormat:{
            apply:{},
            hide:["password"]
        }
    },
    url:{
        login:function(req, res){
            /*登录*/
            var model = {}
            model = this.outFormat(model)
            console.log(model)
            res.send(this.table + "login")
        }
    }
})

module.exports = users