<template>
  <div class="member-manage">
    <el-card class="box-card">
      <!-- 面板头部 -->
      <div slot="header" class="clearfix">
        <span>账号添加</span>
      </div>
      <!-- 面板内容 -->
      <div class="text item">
        <el-form
          :model="memberForm"
          status-icon
          :rules="rules"
          ref="memberForm"
          label-width="100px"
          style="width: 400px;"
          size="small"
          class="demo-ruleForm"
        >
          <!-- 真实名字 -->
          <el-form-item label="真实名字" prop="realname" style="width: 300px;">
            <el-input type="text" v-model="memberForm.realname" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 会员卡卡号 -->
          <el-form-item label="会员卡卡号" prop="membernumber" style="width: 300px;">
            <el-input type="text" v-model="memberForm.membernumber" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 用户组 -->
          <el-form-item label="用户组" prop="usergroup" style="width: 300px;">
            <el-select v-model="memberForm.usergroup" placeholder="------请选择用户组------">
              <el-option label="普通会员-99%" value="普通会员-99%"></el-option>
              <el-option label="铜牌会员-60%" value="铜牌会员-60%"></el-option>
              <el-option label="金牌会员-50%" value="金牌会员-50%"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份证号" prpo="idnumber" style="width: 300px;">
            <el-input type="text" v-model="memberForm.idnumber" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="用户状态">
            <el-radio-group v-model="memberForm.resource">
              <el-radio label="启用"></el-radio>
              <el-radio label="禁用"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机号" prop="phonenumber" style="width: 300px;">
            <el-input type="text" v-model="memberForm.phonenumber" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="座机号码" prop="seatnumber" style="width: 300px;">
            <el-input type="text" v-model="memberForm.seatnumber" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱地址" prop="emailaddress">
            <el-input type="text" v-model="memberForm.emailaddress" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="地区选择">
            <el-select
              v-model="memberForm.region"
              placeholder="-----请选择省分-----"
              style="width:150px"
            >
              <el-option label="四川" value="四川"></el-option>
              <el-option label="重庆" value="重庆"></el-option>
            </el-select>
            <el-select v-model="memberForm.city" placeholder="-----请选择城市----- " style="width:150px">
              <el-option label="成都" value="成都"></el-option>
              <el-option label="重庆" value="重庆"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="详细地址" prop="detailedaddress " style="width: 300px;">
            <el-input type="text" v-model="memberForm.detailedaddress" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮政编码" prop="postalcode" style="width: 300px;">
            <el-input type="text" v-model="memberForm.postalcode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item style=" margin-left: -70px ;">
            <el-button type="primary" @click="memberaddForm()">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      memberForm: {
        realname: "", //真实名字
        membernumber: "", //会员卡卡号
        usergroup: "" ,//用户组
      },
      rules: {
        realname: [
          { required: true, message: "请输您的真实名字", trigger: "blur" }, // 非空验证
          { min: 2, max: 5, message: "长度在 2到 5 个字符", trigger: "blur" } //
        ],
        membernumber: [
          { required: true, message: "请输您的会员卡号", trigger: "blur" }, // 非空验证
          { min: 5, max: 10, message: "长度在 5到 10 个字符", trigger: "blur" } //
        ],
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      },
      discount:'',
     
    };
  },
  methods: {
    memberaddForm() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          //收集数据
          const params = {
            realname: this.memberForm.realname,
            membernumber: this.memberForm.membernumber,
            usergroup: this.memberForm.usergroup,
            idnumber: this.memberForm.idnumber,
            phonenumber: this.memberForm.phonenumber,
            seatnumber: this.memberForm.seatnumber,
            //   resource:this.memberForm.resource,
            emailaddress: this.memberForm.emailaddress,
            region: this.memberForm.region,
            city: this.memberForm.city,
            detailedaddress: this.memberForm.detailedaddress,
            postalcode: this.memberForm.postalcode,
           discount:this.discount
          };
          
          //发送数据给后端
          this.req
            .post("./member/memberadd", params)
            .then(res => {
              let { code, reason } = res;
              //判断
              if (code === 0) {
                //弹成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                //跳转到会员账号管理页面
                this.$router.push("/index/membermanage");
              } else if (code === 1) {
                //弹失败提示
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
@import "./memberadd.less";
</style>