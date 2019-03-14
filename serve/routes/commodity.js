const router = require('./jwt')
//引入数据库连接模块
const connection = require('./comsql')

//接收商品添加请求 接收前端传过来的数据 /commodityadd
router.post('/commodityadd', (req, res) => {

  let {
    category = "",
      barcode = "",
      goodsname = "",
      goodsprice = "",
      marketprice = "",
      goodsinprice = "",
      stocknum = "",
      goodsweight = "",
      goodsunit = "",
      enioy = "",
      promotion = "",
      brief = ""
  } = req.body;

  // 把数据存入数据库
  // 写sql语句
  const sqlstr = `insert into commodity(category,barcode,goodsname,goodsprice,marketprice,goodsinprice,stocknum,goodsweight,goodsunit,enioy,promotion,brief) values('${category}','${barcode}','${goodsname}','${goodsprice}','${marketprice}','${goodsinprice}','${stocknum}','${goodsweight}','${goodsunit}','${enioy}','${promotion}','${brief}')`;

  console.log(sqlstr);

  // 执行sql语句
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    // 判断如果受影响行数大于0 就是成功 否则就是失败
    if (data.affectedRows > 0) {
      // 返回成功的提示信息
      res.send({
        code: 0,
        reason: '添加商品成功'
      });
    } else {
      // 返回失败的提示信息
      res.send({
        code: 1,
        reason: '添加商品失败'
      });
    }
  })



})



/* 接收分页请求： /commoditylistbypage */
router.get('/commoditylistbypage', (req, res) => {
  let {
    pageSize,
    currentPage,
    category,
     keyword
  } = req.query;

  // 写sql语句
  let sqlstr = `select * from commodity where 1=1`;
  
  // 执行sql语句
  let total; // 数据总条数

	// 分类条件（如果不等于全部 和 不等于空 才拼接）
	if (category !== '全部类' && category !== '') {
		sqlstr += ` and category='${category}'`;
	}

	// 关键字条件(不等于空才拼接条件)
	if (keyword !== '') {
		sqlstr += ` and (goodsname like '%${keyword}%' or barcode like '%${keyword}%')`;
	}


 // 再次以拼接后的 sql查询数据库
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
     total = data.length; // 数据总条数
  })

    	// 拼接排序
	sqlstr += ` order by ctime desc`;
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
/* 接收删除请求： /accountdel */
router.get('/commoditydel', (req, res) => {
  //接收id
  const {
      id
  } = req.query;
  // 写sql语句
  const sqlstr = `delete from commodity where id=${id}`;
  connection.query(sqlstr, (err, data) => {
      if (err) throw err;
      // 判断
      if (data.affectedRows > 0) {
          // 返回成功的提示信息

          res.send({
              code: 0,
              reason: '删除商品成功'
          });
      } else {
          // 返回成功的提示信息
          res.send({
              code: 1,
              reason: '删除商品失败'
          });
      }
  })

})
/** 接收修改数据回显的请求: /commodityedit */
router.get('/commodityedit', (req, res) => {
  //接收数据id

  const {
      id
  } = req.query;
  // 写sql语句
  const sqlstr = `select * from commodity where id=${id}`;
  connection.query(sqlstr, (err, data) => {
      if (err) throw err;
      
      
      res.send(data[0]) // 把查询到的数据返回给前端
  })

})
/* 接收保存修改的请求： /commodityeditsave */ 
router.post('/commodityeditsave', (req, res) => {
	// 接收新数据和原来的id
	let { barcode, goodsname,category, id } = req.body;

	// 写sql语句
	const sqlstr = `update commodity set barcode='${barcode}', goodsname='${goodsname}', category='${category}' where id=${id}`;
	// 执行sql语句
	connection.query(sqlstr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			// 返回成功的提示信息
			res.send({code: 0, reason: '修改账号成功'});
		} else {
			// 返回成功的提示信息
			res.send({code: 1, reason: '修改账号失败'});
		}
	})
})

module.exports = router;