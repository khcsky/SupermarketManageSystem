<template>
  <div class="account-add">
    <!-- 账号添加 -->
    <el-card class="box-card">
      <!-- 面板头部 -->
      <div slot="header" class="clearfix">
        <span>账号添加</span>
      </div>
      <!-- 面板内容 -->
      <div class="text item">
        <!-- 登录表单 -->
        <el-form
          :model="accountForm"
          status-icon
          :rules="rules"
          ref="accountForm"
          label-width="100px"
          style="width: 300px;"
          size="small"
          class="demo-ruleForm"
        >
          <!-- 账号 -->
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="accountForm.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="accountForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="accountForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="选择用户组" prop="usergroup">
            <el-select v-model="accountForm.usergroup" placeholder="请选择用户组">
              <el-option label="普通用户" value="普通用户"></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addForm()">添加</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    //自定义验证用户名
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (value.length < 2 || value.length > 5) {
        callback(new Error("长度在 2 到 5 个字符"));
      } else {
        this.req
          .get("./account/accountisname", { username: value })
          .then(res => {
            let { code, reason } = res;
            if (code === 1) {
              callback(new Error(reason));
            } else if (code === 0) {
              callback();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };

    // 自定义验证密码规则
    let validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("长度在 6 到 12 个字符"));
      } else {
        if (this.accountForm.checkPass !== "") {
          this.$refs.accountForm.validateField("checkPass");
        }
        // 成功的回调
        callback();
      }
    };
    // 自定义验证确认密码函数
    let checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.accountForm.password) {
        //如果不等于第一次输入的密码报错
        callback(new Error("两次密码不一致"));
      } else {
        callback(); // 直接调用就是成功
      }
    };
    return {
      accountForm: {
        username: "", // 用户名
        password: "", // 密码
        checkPass: "", // 确认密码
        usergroup: "" //用户组
      },
      rules: {
        // 账号验证
        username: [
          { required: true, validator: validateUserName, trigger: "blur" }
        ],
        // 密码验证
        password: [
          { required: true, validator: validatePwd, trigger: "blur" } // 自定义验证规则
        ],
        checkPass: [
          { required: true, validator: checkPwd, trigger: "blur" } // 自定义验证规则
        ],
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    addForm() {
      this.$refs.accountForm.validate(valid => {
        if (valid) {
          //收集数据
          const params = {
            account: this.accountForm.username,
            password: this.accountForm.password,
            usergroup: this.accountForm.usergroup
          };

          // 把数据发送给后端（axios）
          this.req
            .post("./account/accoundadd", params)
            .then(res => {
              //接收后端数据
              let { code, reason } = res;
              //判断
              if (code === 0) {
                //弹成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.$router.push("/index/accountmanage"); //跳转到账号管理
              } else if (code === 1) {
                //弹失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });

          //
        } else {
          console.log("验证失败!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.accountForm.resetFields();
    }
  }
};
</script>
<style lang="less">
.account-add {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
}
</style>