<template>
  <div class="password-modfiy">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>密码修改</span>
      </div>
      <div class="text item">
        <el-form
          :model="updateForm"
          status-icon
          :rules="rules"
          ref="updateForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width:300px"
          size="small"
        >
          <!--密码 -->
          <el-form-item label="原密码" prop="oldpwd">
            <el-input type="text" v-model="updateForm.oldpwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="newpwd">
            <el-input type="password" v-model="updateForm.newpwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认新密码" prop="checknewpwd">
            <el-input type="password" v-model="updateForm.checknewpwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updatepwdForm()">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    //验证 旧密码
    const oldpwd = (rule, value, callback) => {
      //发送请求给后端 把用户输入的原密码发给后端
      this.req
        .get("./account/oldpwd", { oldpwd: value })
        .then(res => {
          // 接收数据
          let { code, reason } = res;
          // 判断
          if (code === 1) {
            // 验证失败
            callback(new Error(reason));
          } else if (code === 0) {
            // 验证成功
            callback();
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    //验证 新密码
    const newpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("长度在 6 到 12 个字符"));
      } else if (value === this.updateForm.oldpwd) {
        callback(new Error("不能和旧密码相同"));
      } else {
        if (this.updateForm.checknewpwd !== "") {
          this.$refs.updateForm.validateField("checknewpwd");
        }
        callback(); // 成功
      }
    };
    //验证 确认新密码

    const checknewpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("长度在 6 到 12 个字符"));
      } else if (value !== this.updateForm.newpwd) {
        // 一致性验证
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      updateForm: {
        oldpwd: "", // 旧密码
        newpwd: "", // 新密码
        checknewpwd: "" // 确认新密码
      },
      rules: {
        oldpwd: [{ required: true, validator: oldpwd, trigger: "blur" }],

        newpwd: [{ required: true, validator: newpwd, trigger: "blur" }],

        checknewpwd: [
          { required: true, validator: checknewpwd, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    updatepwdForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          let params = {
            newpwd: this.updateForm.newpwd
          };
          //发送请求给后端 把新密码发给后端
          this.req
            .post("./account/newpwd", params)
            .then(res => {
              let { code, reason } = res;
              // 判断
              if (code === 0) {
                // 弹成功提示
                this.$message({
                  type: "success",
                  message: reason
                });

                // 清除token
                window.localStorage.removeItem("token");

                setTimeout(() => {
                  // 跳转到登录
                  this.$router.push("/login");
                }, 1000);
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("验证失败!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.password-modfiy {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
}
</style>