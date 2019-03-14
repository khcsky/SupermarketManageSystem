const router = require('./jwt')
//引入数据库连接模块
const connection = require('./comsql')

//接收前端账号添加请求 /memberadd
router.post('/memberadd', (req, res) => {
  //接收前端参数
  let {
    realname,
    membernumber,
    usergroup,
    idnumber = "",
    phonenumber = "",
    seatnumber = "",
    emailaddress = "",
    region = "",
    city = "",
    detailedaddress = "",
    postalcode = "",
    discount
  } = req.body;

  discount=usergroup.substring(5)//截取字符串
 
  
  // 把数据存入数据库
  // 写sql语句
  const sqlstr = `insert into member(realname ,membernumber,usergroup,idnumber,phonenumber,seatnumber,emailaddress,region,city,detailedaddress,postalcode,discount) values('${realname}','${membernumber}','${usergroup}','${idnumber}','${phonenumber}','${seatnumber}','${emailaddress}','${region}','${city}','${detailedaddress}','${postalcode}','${discount}')`

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

/** 接收修改数据回显的请求: /memberedit */

router.get('/memberedit', (req, res) => {

  const {
    id
  } = req.query;
  // 写sql语句
  const sqlstr = `select * from member where id=${id}`;
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;

    res.send(data[0]) // 把查询到的数据返回给前端

  })
})

/**接收保存修改的请求 /membereditsave */
router.post('/membereditsave', (req, res) => {
  //接收前端传过来的数据
  let {
    membernumber,
    realname,
    usergroup,
    phonenumber,
    seatnumber,
    id
  } = req.body;
  //把数据存入库
  const sqlstr =  `update member set membernumber='${membernumber}', realname='${realname}', usergroup='${usergroup}', phonenumber='${phonenumber}', seatnumber='${seatnumber}' where id=${id}`;
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

//接受分页请求
router.get('/memberlistbypage',(req,res)=>{
  let { pageSize ,currentPage}=req.query;

  // 写sql语句
  let sqlstr = `select * from member order by ctime desc`;
  connection.query(sqlstr,(err,data)=>{
      if (err) throw err;      
      let total = data.length; // 数据总条数
      //计算跳过多少条
      let  n =(currentPage - 1) * pageSize;

    //写sql语句
    sqlstr += ` limit ${n}, ${pageSize}`;

   connection.query(sqlstr,(err,data)=>{
       if(err) throw err;
       
      res.send({total, data }); // 把数据总条数和每页对应数据给前端
   })
      
  
  })
   
  
})
module.exports = router;