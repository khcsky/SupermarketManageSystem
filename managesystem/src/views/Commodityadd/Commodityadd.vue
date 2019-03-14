<template>
  <div class="commodity-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加商品</span>
      </div>
      <div class="text item">
        <el-form
          :model="goodsForm"
          status-icon
          :rules="rules"
          ref="goodsForm"
          label-width="100px"
          size="small"
          class="demo-ruleForm"
        >
          <el-form-item label="所属分类:" prop="category" style="width:200px">
            <el-select v-model="goodsForm.category" placeholder="---选择分类---" style="width:200px">
              <el-option label="全部类" value="全部类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="服装类" value="服装类"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品条形码:" prop="barcode" style="width:200px">
            <el-input
              type="text"
              v-model="goodsForm.barcode"
              autocomplete="off"
              style="width:200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="商品名称:" prop="goodsname" style="width:200px">
            <el-input
              type="text"
              v-model="goodsForm.goodsname"
              autocomplete="off"
              style="width:200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="商品售价:" prop="goodsprice" style="width:110px">
            <el-row>
              <el-col :span="22">
                <el-input
                  type="text"
                  v-model.number="goodsForm.goodsprice"
                  autocomplete="off"
                  style="width:100px"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <div>元</div>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="市场价:" prop="marketprice" style="width:140px">
            <el-row>
              <el-col :span="17.5">
                <el-input
                  type="text"
                  v-model="goodsForm.marketprice "
                  autocomplete="off"
                  style="width:100px"
                ></el-input>
              </el-col>
              <el-col :span="6.5">元</el-col>
            </el-row>
            <span class="comword">默认市场价位售价的1.2倍</span>
          </el-form-item>

          <el-form-item label="商品进价:" prop="goodsinprice" style="width:110px">
            <el-row>
              <el-col :span="22">
                <el-input
                  type="text"
                  v-model="goodsForm.goodsinprice"
                  autocomplete="off"
                  style="width:100px"
                ></el-input>
              </el-col>
              <el-col :span="2">元</el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="入库数量:" prop="stocknum" style="width:100px">
            <el-input
              type="text"
              v-model="goodsForm.stocknum"
              autocomplete="off"
              style="width:100px"
            ></el-input>
            <span class="comword">记重商品为千克</span>
          </el-form-item>

          <el-form-item label="商品重量:" prop="goodsweight" style="width:100px">
            <el-input
              type="text"
              v-model="goodsForm.goodsweight"
              autocomplete="off"
              style="width:100px"
            ></el-input>
          </el-form-item>

          <el-form-item label="商品单位:" prop="goodsunit" style="width:100px">
            <el-input
              type="text"
              v-model="goodsForm.goodsunit"
              autocomplete="off"
              style="width:100px"
            ></el-input>
          </el-form-item>

          <el-form-item label="会员优惠:" prop="enioy" style="width:120px">
            <el-row>
              <el-col :span="12">
                <el-radio v-model="goodsForm.enioy" label="享受">享受</el-radio>
              </el-col>
              <el-col :span="12">
                <el-radio v-model="goodsForm.enioy" label="不享受">不享受</el-radio>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="是否促销:" prop="promotion" style="width:120px">
            <el-row>
              <el-col :span="12">
                <el-radio v-model="goodsForm.promotion" label="启用">启用</el-radio>
              </el-col>
              <el-col :span="12">
                <el-radio v-model="goodsForm.promotion" label="禁用">禁用</el-radio>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="商品简介:" prop="brief" style="width:100%">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="goodsForm.brief"></el-input>
            <span class="comword">不超过两百个字</span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addForm()">添加</el-button>
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

    let validatePrice = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("售价不能为空"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("输入的值必须是数值"));
      } else {
        callback();
      }
      if (value) {
        this.goodsForm.marketprice = (value * 1.2).toFixed(2);
        this.goodsForm.goodsinprice = (value * 0.5).toFixed(2);
      }
    };
    return {
      goodsForm: {
        category: "",
        barcode: "",
        goodsname: "",
        goodsprice: "",
        marketprice: "",
        goodsinprice: "",
        stocknum: "",
        goodsweight: "",
        goodsunit: "",
        enioy: "",
        promotion: "",
        brief: ""
      },
      rules: {
        category: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        goodsname: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 5, message: "长度在 3 到 8 个字符", trigger: "blur" } //
        ],
        goodsprice: [
          { required: true, validator: validatePrice, trigger: "blur" } // 自定义验证规则
        ],
        barcode: [
          { required: true, message: "请选择输入条形码", trigger: "blur" }
        ],
        marketprice: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsinprice: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        stocknum: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsweight: [{ required: true, message: "不能为空", trigger: "blur" }],
        goodsunit: [{ required: true, message: "不能为空", trigger: "blur" }],
        enioy: [{ required: true, message: "不能为空", trigger: "change" }],
        promotion: [{ required: true, message: "不能为空", trigger: "change" }],
        brief: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    addForm() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          //收集数据
          const params = {
            category: this.goodsForm.category,
            barcode: this.goodsForm.barcode,
            goodsname: this.goodsForm.goodsname,
            goodsprice: this.goodsForm.goodsprice,
            marketprice: this.goodsForm.marketprice,
            goodsinprice: this.goodsForm.goodsinprice,
            stocknum: this.goodsForm.stocknum,
            goodsweight: this.goodsForm.goodsweight,
            goodsunit: this.goodsForm.goodsunit,
            enioy: this.goodsForm.enioy,
            promotion: this.goodsForm.promotion,
            brief: this.goodsForm.brief
          };
          //发送请求给后端 把收集数据传给后端

          this.req
            .post("./commodity/commodityadd", params)
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                //弹成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.$router.push("/index/commoditymanage"); //跳转到账号管理
              } else if (code === 1) {
                //弹失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });

          //this.$router.push("/index/commoditymanage"); //跳转到账号管理
        } else {
          console.log("商品添加失败!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "./commodityadd.less";
</style>