<template>
  <div class="repertory-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品入库</span>
      </div>
      <div class="text item">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
           ref="goodsForm"
          :model="goodsForm"
          :rules="rules"
          style="width:200px"
          size="small"
        >
          <el-form-item label="条形码" prop="barcode">
            <el-input v-model="goodsForm.barcode"></el-input>
          </el-form-item>

          <el-form-item label="数量" prop="stocknum">
            <el-input v-model="goodsForm.stocknum" style="width:100px"></el-input>

            <div class="word">记重商品单位为kg</div>
          </el-form-item>

          <el-form-item label="进价" prop="goodsinprice">
            <el-input v-model="goodsForm.goodsinprice" style="width:100px"></el-input>
            <span>元</span>
          </el-form-item>
           <el-form-item>
            <el-button type="primary" @click="addForm()">入库</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义验证密码规则


    return {
      labelPosition: "top",
      
      goodsForm: {
        barcode: "",
        goodsinprice: "",
        stocknum: ""
      },
      rules: {
        barcode: [
          { required: true, message: "请选择输入条形码", trigger: "blur" }
        ],

        stocknum: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsinprice: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    addForm() {
        this.$refs.goodsForm.validate(valid => {
        if (valid) {
          //收集数据
          const params = {
            barcode: this.goodsForm.barcode,
            goodsinprice: this.goodsForm.goodsinprice,
            stocknum: this.goodsForm.stocknum
          };
          //发送请求给后端 把收集数据传给后端

          this.req
            .post("./commodity/repertoryadd", params)
            .then(res => {

          
              let { code, reason } = res;
              if (code === 0) {
                //弹成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.$router.push("/index/repertorymanage"); //跳转到账号管理
              } else if (code === 1) {
                //弹失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });

         
        } else {
          console.log("商品添加失败!");
          return false;
        }
  
    })
    }
  }
};
</script>
<style lang="less">
.repertory-add {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
    .word{
        font-size: 10px ;
        color: #aaa;
        margin-top: -10px;
    }
  }
}
</style>