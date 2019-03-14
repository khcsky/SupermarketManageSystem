const router = require('./jwt')
//引入数据库连接模块
const connection = require('./comsql')

//接收请求 接收账号和密码 /checklogin
router.post('/checklogin',(req,res)=>{
  let { account,password} = req.body;

  //写sql语句
  const sqlstr = `select * from account where account='${account}'and password='${password}'`;
  
  //执行sql语句

  connection.query(sqlstr,(err,data)=>{
    if(err) throw err;
 
    if(data.length){

        // 对象浅拷贝
        const userInfo = Object.assign({},data[0]);
        //生成token
        const token = jwt.sign(userInfo,secretKey,{
          expiresIn : 60 * 60 * 10 // token过期时间
        })

           res.send({code :0, reason : '欢迎你！登录成功!',token})

    }else{
      res.send({code :1, reason : '登录失败，请检查账号或密码!'})
    }
  })
  
  
})

/* 获取角色 */
router.get('/getrole', (req, res) => {
	// 获取用户组
	let { usergroup } = req.user;

	// 角色数组
	let roles = [];
	if (usergroup === '超级管理员') {
		roles.push('admin')
	} else if ( usergroup === '普通用户' ) {
		roles.push('normal')
	}

	res.send({roles})
}) 
module.exports = router;
