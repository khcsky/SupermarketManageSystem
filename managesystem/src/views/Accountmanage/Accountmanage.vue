<template>
  <div class="account-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <div class="text item">
        <el-table
          ref="accountTableData"
          :data="accountTableData"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- 多选框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 用户名称 -->
          <el-table-column prop="account" label="用户名称"></el-table-column>

          <!-- 用户组 -->
          <el-table-column prop="usergroup" label="用户组"></el-table-column>

          <!-- 日期 -->
          <el-table-column label="日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
          </el-table-column>
          <!-- 管理 -->
          <el-table-column label="管理">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button size="mini" type="primary" @click="handleEdit( scope.row.id )">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <!-- 删除 -->
              <el-button size="mini" type="danger" @click="handleDelete( scope.row.id )">
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 6, 8]"
          :page-size="3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <div style="margin-top:20px;">
          <el-button @click="batchesdel" type="danger">批量删除</el-button>
          <el-button @click="cancelselect" type="primary">取消选中</el-button>
        </div>
        <!-- 模态框 -->
        <el-dialog width="400px" title="用户名修改" :visible.sync="dialogFormVisible">
          <!-- 表格 -->
          <el-form :model="accountEditForm" prop="usergroup" :rules="rules" style="width: 320px;">
            <!-- 账号 -->
            <el-form-item label="用户名" prop="account" :label-width="formLabelWidth">
              <el-input v-model="accountEditForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item label="用户组" :label-width="formLabelWidth">
              <el-select v-model="accountEditForm.usergroup" placeholder="请选择用户组">
                <el-option label="普通用户" value="普通用户"></el-option>
                <el-option label="超级管理员" value="超级管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      rules: {
        //模态框验证
        // 用户名
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }, // 非空验证
          { min: 3, max: 5, message: "账号长度在 3 到 5 位" } // 长度验证
        ]
      },
      // 账号列表数据
      accountTableData: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      accountEditForm: {
        // 修改表单的数据
        account: "",
        usergroup: ""
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      selectedId: [], // 选中的id数组
      total: 0,
      currentPage: 1, //当前默认页
      pageSize: 3 //每页多少条数据
    };
  },
  methods: {
    // //请求账号所有数据
    // getAccontList() {
    //   this.req
    //     .get("./account/accoutlist")
    //     .then(res => {
    //       this.accountTableData = res;
    //     })
    //     .catch(err => {
    //      //收集参数（每页多少条 和当前页码）

    //     });
    // },
    // 按照分页请求数据
    getAccontListByPage(){
         let params = {
           pageSize: this.pageSize,
           currentPage: this.currentPage
         }
       
         
         //发送请求给后端 把收集的参数条件发给后端
         this.req.get('./account/accountlistbypage',params)
         .then(res=>{
            let { total,data}=res;
            
            this.total = total;
            this.accountTableData =data;
           
            // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
           if (!data.length && this.currentPage !== 1) {
                        this.currentPage -= 1;  // 当前页码自减1
                       this.getAccontListByPage(); // 再次请求数据
                    }
         })
         .catch(err=>{
                 console.log(err);
         })
    },
    //删除函数
    handleDelete(id) {
      // 优化删除体验
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.req
            .get("./account/accountdel", { id })
            .then(res => {
              // 接收后端返回的数据
              let { code, reason } = res;
              // 判断
              if (code === 0) {
                // 弹出成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表数据
                this.getAccontListByPage();
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改函数
    handleEdit(id) {
      // 显示模态框
      this.dialogFormVisible = true;
      //保存数据原来的id
      this.editId = id;
      //发送请求给后端
      this.req
        .get("./account/accountedit", { id })
        .then(res => {
          //接收后端数据
          let { account, usergroup } = res;
          // 回填表单
          this.accountEditForm.account =account;
          this.accountEditForm.usergroup = usergroup;
         
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存修改
    saveEdit() {
      // 关闭模态框
      this.dialogFormVisible = false;

      //收集修改后的新数据和原来的id

      let params = {
        account: this.accountEditForm.account,
        usergroup: this.accountEditForm.usergroup,
        id: this.editId
      };
      console.log();
      
      // 把新数据和原来id一起发送给后端

      this.req
        .post("./account/accounteditsave", params)
        .then(res => {
          // 接收后端数据
          let { code, reason } = res;
          // 判断
          if (code === 0) {
            //弹成功提示
            this.$message({
              type: "success",
              message: reason
            });
            // 刷列表
             this.getAccontListByPage();
          } else if (code === 1) {
            // 弹失败提示
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取消选择
    cancelselect() {
      this.$refs.accountTableData.clearSelection(); // 整个表格调用取消选择方法
    },
    // 当选择项发生改变触发
    handleSelectionChange(val) {
      // val就是选中的数据 把选中数据的id取出来 放在一个数组中
      this.selectedId = val.map(v => v.id);
    },
    //批量删除
    batchesdel() {
      // 如果用户不选 弹出提示 直接return

      if (!this.selectedId.length) {
        this.$message.error("你是pig吗 不选就想删!");
        return;
      }
      this.$confirm("是否批量删除?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.req
            .get("/account/batchesdel", { idArr: this.selectedId })
            .then(res => {
              let { code, reason } = res;
              //判断
              if (code === 0) {
                //弹成功提示 更新列表
                this.$message({
                  type: "success",
                  message: "reason"
                });
                this.getAccontListByPage();
              } else if (code === 1) {
                // 弹失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "已取消批量删除"
          });
        });
    },
    // 每页条数变化触发
    handleSizeChange(val) {
         
           this.pageSize = val; // 每页多少条
            this.getAccontListByPage(); // 调用分页函数
    },
     // 当前页码变化触发
    handleCurrentChange(val) {
   
          this.currentPage = val; // 当前页
           this.getAccontListByPage(); // 调用分页函数
    }
  },
  //生命周期钩子函数
  created() {
    // this.getAccontList();

    // 调用按照分页显示数据的函数
    this.getAccontListByPage()
  },
  //过滤器
  filters: {
    filterCtime(ctime) {
      return moment(ctime).format("YYYY/MM/DD hh:mm:ss");
    }
  }
};
</script>
<style lang="less">
.account-manage {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: bold;
      background-color: #f1f1f1;
    }
  }
}
</style>