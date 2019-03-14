<template>
  <div class="member-manage">
    <el-card class="box-card">
      <!-- 面板头部 -->
      <div slot="header" class="clearfix">
        <span>会员管理</span>
      </div>
      <!-- 面板内容 -->
      <div class="text item">
        <el-form ref="memberManageForm" :model="memberManageForm" label-width="50px" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="收索:">
                <el-input v-model="memberManageForm.usersearch" style=" width:200px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <span class="member-word">会员卡，会员名，电话，手机</span>&ensp;
              <el-button type="success" size="small">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <hr>
        <el-table
          ref="memberTableData2"
          :data="memberTableData"
          @selection-change="handleSelectionChange"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- 日期 -->
          <el-table-column label="日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
          </el-table-column>
          <!-- 会员卡卡号 -->
          <el-table-column prop="membernumber" label="会员卡卡号"></el-table-column>
          <!-- 用户名称 -->
          <el-table-column prop="realname" label="会员姓名"></el-table-column>

          <!-- 会员等级 -->
          <el-table-column prop="usergroup" label="会员等级"></el-table-column>

          <!-- 会员积分 -->
          <el-table-column prop="memberintegral" label="会员积分"></el-table-column>

          <!-- 折扣 -->
          <el-table-column prop="discount" label="折扣"></el-table-column>

          <!-- 手机号 -->
          <el-table-column prop="phonenumber" label="手机号"></el-table-column>

          <!-- 座机号 -->
          <el-table-column prop="seatnumber" label="座机号"></el-table-column>
          <!-- 管理 -->
          <el-table-column label="管理">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button size="mini" type="primary" @click="handleEdit( scope.row.id )">
                <i class="el-icon-edit"></i> 编辑
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
        <!-- 模态框 -->
        <el-dialog width="400px" title="用户名修改" :visible.sync="dialogFormVisible">
          <el-form :model="memberEditForm" :rules="rules" style="width: 320px;">
            <!-- 会员卡卡号 -->
            <el-form-item label="会员卡卡号" prop="membernumber" :label-width="formLabelWidth">
              <el-input v-model="memberEditForm.membernumber" autocomplete="off"></el-input>
            </el-form-item>
            <!-- realname -->
            <el-form-item label="会员姓名" prop="realname" :label-width="formLabelWidth">
              <el-input v-model="memberEditForm.realname" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item label="会员等级" prop="usergroup" :label-width="formLabelWidth">
              <el-select v-model="memberEditForm.usergroup" placeholder="请选择会员等级">
                <el-option label="普通会员-99%" value="普通会员-99%"></el-option>
                <el-option label="铜牌会员-60%" value="铜牌会员-60%"></el-option>
                <el-option label="金牌会员-50%" value="金牌会员-50%"></el-option>
              </el-select>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item label="手机号" prop="phonenumber" :label-width="formLabelWidth">
              <el-input v-model="memberEditForm.phonenumber" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 座机号 -->
            <el-form-item label="座机号" prop="seatnumber" :label-width="formLabelWidth">
              <el-input v-model="memberEditForm.seatnumber" autocomplete="off"></el-input>
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
      rules: {},
      memberManageForm: {},
      memberTableData: [

      ],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      memberEditForm: {
        // 修改表单的数据
        membernumber: "",
        realname: "",
        usergroup: "",
        phonenumber: "",
        seatnumber: ""
      },
      discount:"",
      editId: 0, // 需要修改的数据的id
      formLabelWidth: "100px",
      total: 0,
      currentPage: 1, //当前默认页
      pageSize: 3 //每页多少条数据
    };
  },
  methods: {
    //发送分页请求
    getMemberListByPage() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };

      //发送请求给后端 把收集的参数条件发给后端
      this.req
        .get("./member/memberlistbypage", params)
        .then(res => {
          let { total, data } = res;
          this.total = total;
          this.memberTableData = data;
      
             
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!data.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getMemberListByPage(); // 再次请求数据
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改
    handleEdit(id) {
      // 显示模态框
      this.dialogFormVisible = true;
      //保存数据原来的id
      this.editId = id;

      this.req
        .get("./member/memberedit", { id })
        .then(res => {
          let {
            membernumber,
            realname,
            usergroup,
            phonenumber,
            seatnumber
          } = res;

          // 回填表单
          this.memberEditForm.membernumber = membernumber;
          this.memberEditForm.realname = realname;
          this.memberEditForm.usergroup = usergroup;
          this.memberEditForm.phonenumber = phonenumber;
          this.memberEditForm.seatnumber = seatnumber;
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
        membernumber: this.memberEditForm.membernumber,
        realname: this.memberEditForm.realname,
        usergroup: this.memberEditForm.usergroup,
        phonenumber: this.memberEditForm.phonenumber,
        seatnumber: this.memberEditForm.seatnumber,
        id: this.editId
      };

      this.req
        .post("./member/membereditsave", params)
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
            this.getMemberListByPage();
          } else if (code === 1) {
            // 弹失败提示
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange() {},
    // 每页条数变化触发
    handleSizeChange(val) {
      this.pageSize = val; // 每页多少条
      this.getMemberListByPage();
    },
    // 当前页码变化触发
    handleCurrentChange(val) {
      this.currentPage = val; // 当前页
      this.getMemberListByPage();
    }
  },

  created() {
    // this.getmerberList();
    this.getMemberListByPage();
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
@import "./membermanage.less";
</style>