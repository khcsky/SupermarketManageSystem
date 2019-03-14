//连接数据库
const mysql = require('mysql')//引入mysql模块

// 使用mysql模块的方法创建连接对象
const connection = mysql.createConnection({
    host     : 'localhost', // 服务器地址
    user     : 'root', // mysql的账号
    password : '1212', // mysql的密码
    database : 'sky' // 要连接的数据库的名字
  });

//执行连接
connection.connect(()=>{
    console.log('数据库连接成功');
    
});
//暴露出去

module.exports = connection;
