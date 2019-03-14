const router = require('./jwt')
//引入数据库连接模块
const connection = require('./comsql')

/*接收账号添加请求：/accoundadd */
router.post('/accoundadd', (req, res) => {

    //接收前端参数
    let {
        account,
        password,
        usergroup
    } = req.body;

    // 把数据存入数据库
    // 写sql语句
    const sqlstr = `insert into account(account,password,usergroup) values('${account}','${password}','${usergroup}')`;


    //执行sql语句
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        // 判断如果受影响行数大于0 就是成功 否则就是失败
        if (data.affectedRows > 0) {
            // 返回成功的提示信息
            res.send({
                code: 0,
                reason: '添加账号成功'
            });
        } else {
            // 返回失败的提示信息
            res.send({
                code: 1,
                reason: '添加账号失败'
            });
        }
    })

})



/* 接收删除请求： /accountdel */
router.get('/accountdel', (req, res) => {
    //接收id
    const {
        id
    } = req.query;
    // 写sql语句
    const sqlstr = `delete from account where id=${id}`;
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        // 判断
        if (data.affectedRows > 0) {
            // 返回成功的提示信息

            res.send({
                code: 0,
                reason: '删除账号成功'
            });
        } else {
            // 返回成功的提示信息
            res.send({
                code: 1,
                reason: '删除账号失败'
            });
        }
    })

})
/** 接收修改数据回显的请求: /accountedit */
router.get('/accountedit', (req, res) => {
    //接收数据id

    const {
        id
    } = req.query;
    // 写sql语句
    const sqlstr = `select * from account where id=${id}`;
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        res.send(data[0]) // 把查询到的数据返回给前端
    })

})
/**接收保存修改的请求 /accounteditsave */
router.post('/accounteditsave', (req, res) => {
    //接收前端传过来的数据
    let {
        account,
        usergroup,
        id
    } = req.body;
    //把数据存入库
    const sqlstr = `update account set account='${account}', usergroup='${usergroup}' where id=${id}`;
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        // 判断如果首影响行数大于0 就是成功 否则就是失败
        if (data.affectedRows > 0) {
            //返回成功提示信息
            res.send({
                code: 0,
                reason: '修改账号成功'
            });

        } else {
            // 返回失败的提示信息
            res.send({
                code: 1,
                reason: '修改账号失败'
            });
        }

    })

})
/** 接收批量删除请求 /batchesdel*/
router.get('/batchesdel', (req, res) => {
    //接收数据
    let {
        idArr
    } = req.query;

    //写sql语句
    const sqlstr = `delete from account where id in(${idArr})`;
    //执行sql语句
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        //判断
        if (data.affectedRows > 0) {
            res.send({
                code: 0,
                reason: '批量删除成功'
            })
        } else {
            res.send({
                code: 1,
                reason: '批量删除失败'
            })
        }

    })

})
/* 接收分页请求： /accountlistbypage */

router.get('/accountlistbypage', (req, res) => {
    let {
        pageSize,
        currentPage
    } = req.query;

    // 写sql语句
    let sqlstr = `select * from account order by ctime desc`;


    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        let total = data.length; // 数据总条数
        //计算跳过多少条
        let n = (currentPage - 1) * pageSize;

        //写sql语句
        sqlstr += ` limit ${n}, ${pageSize}`;

        connection.query(sqlstr, (err, data) => {
            if (err) throw err;
            res.send({
                total,
                data
            }); // 把数据总条数和每页对应数据给前端
        })


    })


})

/** 接收用户名和头像请求  /accountnameandavatar*/

router.get('/accountnameandavatar', (req, res) => {


    const {
        account,
        id
    } = req.user

    // 写sql语句
    const sqlStr = `select * from account where id=${id}`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        const avatarurl = data[0].avatarurl || '/upload/defavatar.jpg';

        res.send({
            account,
            avatarurl
        }) // 返回账号名给前端
    })

})

//接受前端验证用户名是否存在请求

router.get('/accountisname', (req, res) => {

    let {
        username
    } = req.query;

    var json = {
        account: username
    };

    let sqlstr = `select account from account`

     connection.query(sqlstr, (err, data) => {
        if (err) throw err;

        //将遍历出来的对象放入一个新数组
        let arr = [];
        for (var i in data) {
            let userInfo = Object.assign({}, data[i]);
            arr.push(userInfo)
        }


      //判断账号是否存在 把信息返回给前端
        if (JSON.stringify(arr).indexOf(JSON.stringify(json)) === -1) {
            res.send({
                code: 0,
                reason: "账号不存在"
            })
        } else {
            res.send({
                code: 1,
                reason: "账号以存在,请从新输入"
            })
        }




    })

});

//验证旧密码 oldpwd

router.get('/oldpwd', (req, res) => {
    // 接收旧密码
    let {
        oldpwd
    } = req.query;
    // 判断
    if (oldpwd === req.user.password) {
        res.send({
            code: 0,
            reason: '旧密码正确'
        })
    } else {
        res.send({
            code: 1,
            reason: '旧密码错误 请重新输入'
        })
    }
})
//接收新密码并保存

router.post('/newpwd', (req, res) => {

    let {
        newpwd
    } = req.body;
    // 获取当前登录用户的id
    let {
        id
    } = req.user

    // 写sql语句
    const sqlstr = `update account set password='${newpwd}' where id=${id}`;

    connection.query(sqlstr, (err, data) => {

        if (err) throw err;
        // 判断
        if (data.affectedRows > 0) {
            res.send({
                code: 0,
                reason: '修改密码成功 请重新登录'
            })
        } else {
            res.send({
                code: 1,
                reason: '修改密码失败'
            })
        }
    })


})

/*  接收销售数据的请求: /salesdata */
router.get('/salesdata', (req, res) => {
    // 准备一份报表数据
    // 写sql语句
    const sqlStr = `select * from sales where ctime between '2019-03-01 00:00:00' and '2019-03-07 23:00:00'`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data) // 把数据返回给前端
    })
})

/*  接收销售数据的请求: /salesdata */
router.get('/stocksdata', (req, res) => {
    // 准备一份报表数据
    // 写sql语句
    const sqlStr = `select * from stocks where ctime between '2019-03-01 00:00:00' and '2019-03-07 23:00:00'`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data) // 把数据返回给前端
    })
})

/* 头像上传 */

// 文件上传第三方模块
const multer = require('multer');

// 配置存储路径 重命名
const storage = multer.diskStorage({
    destination: 'public/upload', // 文件上传到服务器要放入的目录
    // 文件名（重命名）
    filename: function (req, file, cb) { // 123.jpb
        var fileFormat = (file.originalname).split("."); // [4, jpg] 把文件的名字变为数组
        var filename = new Date().getTime(); // 获取当前时间戳
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
const upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {

    // 获取图片名字
    let {
        filename
    } = req.file;
    // 获取当前登录用户的id
    let {
        id
    } = req.user;

    // 拼接图片路径
    const imgurl = `/upload/${filename}`;

    // 构造sql语句
    const sqlStr = `update account set avatarurl='${imgurl}' where id=${id}`;

    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({
                code: 0,
                reason: '头像上传成功',
                imgurl
            })
        } else {
            res.send({
                code: 1,
                reason: '头像上传失败'
            })
        }
    })
})



module.exports = router;