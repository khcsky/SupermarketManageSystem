<template>
  <div class="repertory-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <div class="text item">
        <el-form
          :model="searchForm"
          status-icon
          :rules="rules"
          ref="searchForm"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
        >
          <el-row type="flex" class="row-bg">
            <el-col :span="5">
              <el-select v-model="searchForm.category" placeholder="---选择分类---" style="width:200px">
                <el-option label="全部类" value="全部类"></el-option>
                <el-option label="食品类" value="食品类"></el-option>
                <el-option label="服装类" value="服装类"></el-option>
              </el-select>
            </el-col>

            <el-col :span="5">
              <el-input v-model="searchForm.keyword" placeholder="输入商品名称条形码"></el-input>
            </el-col>

            <el-col :span="5">
              <el-button type="success" @click="search">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <hr>

        <el-table
          ref="goodsTableData"
          :data="goodsTableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- 商品条形码 -->
          <el-table-column prop="barcode" label="商品条形码"></el-table-column>

          <!-- 商品名称 -->
          <el-table-column prop="goodsname" label="商品名称"></el-table-column>

          <!-- 所属分类 -->
          <el-table-column prop="category" label="所属分类"></el-table-column>

          <!-- 进价元 -->
          <el-table-column prop="goodsinprice" label="进价(元)"></el-table-column>
          <!-- 入库 -->
          <el-table-column prop="stocknum" label="入库"></el-table-column>

          <!-- 库存 -->
          <el-table-column prop="repertory" label="库存"></el-table-column>

          <!-- 已售 -->
          <el-table-column prop="sold" label="已售"></el-table-column>

         

          <!-- 管理 -->
          <el-table-column label="管理">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="handleEdit( scope.row.id )">
                <i class="el-icon-edit"></i>
              </a> &nbsp;
              <a href="javascript:void(0)" @click="handleDelete( scope.row.id )">
                <i class="el-icon-delete"></i>
              </a>
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
        <el-dialog width="400px" title="商品修改" :visible.sync="dialogFormVisible">
          <!-- 表格 -->
          <el-form :model="goodsEditForm" :rules="rules" style="width: 320px;">
            <!-- 条形码 -->
            <el-form-item label="条形码" prop="barcode" :label-width="formLabelWidth">
              <el-input v-model="goodsEditForm.barcode" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goodsname" :label-width="formLabelWidth">
              <el-input v-model="goodsEditForm.goodsname" autocomplete="off"></el-input>
            </el-form-item>

            <!-- 所属分类 -->
            <el-form-item label="所属分类:" prop="category" :label-width="formLabelWidth">
              <el-select
                v-model="goodsEditForm.category"
                placeholder="---选择分类---"
                style="width:220px"
              >
                <el-option label="全部类" value="全部类"></el-option>
                <el-option label="食品类" value="食品类"></el-option>
                <el-option label="服装类" value="服装类"></el-option>
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
export default {
  data() {
    return {
      searchForm: {
        category: "",
        keyword: ""
      },
      goodsForm: {
        category: "",
        barcode: ""
      },
      rules: {},
      input: "",

      goodsTableData: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      goodsEditForm: {
        // 修改表单的数据
        barcode: "",
        goodsname: "",
        category: ""
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
    //查询
    search() {
      this.getCommodityListByPage();
      
    },
    //分页
    getCommodityListByPage() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        category: this.searchForm.category,
        keyword: this.searchForm.keyword
      };

      //发送请求给后端 把收集的参数条件发给后端
      this.req
        .get("./commodity/commoditylistbypage", params)
        .then(res => {
          let { total, data } = res;

          this.total = total;
          this.goodsTableData = data;

          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!data.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getCommodityListByPage(); // 再次请求数据
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 每页条数变化触发
    handleSizeChange(val) {
      this.pageSize = val; // 每页多少条
      this.getCommodityListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 每页多少条
      this.getCommodityListByPage(); // 调用分页函数
    },
    //删除
    handleDelete(id) {
      // 优化删除体验
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.req
            .get("./commodity/commoditydel", { id })
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
                this.getCommodityListByPage();
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
        .get("./commodity/commodityedit", { id })
        .then(res => {
          //接收后端数据
          let { barcode, goodsname, category } = res;
          // 回填表单
          this.goodsEditForm.barcode = barcode;
          this.goodsEditForm.goodsname = goodsname;
          this.goodsEditForm.category = category;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改保存
    saveEdit() {
      // 关闭模态框
      this.dialogFormVisible = false;
      // 收集修改后的新数据和原来的id
      let params = {
        barcode: this.goodsEditForm.barcode,
        goodsname: this.goodsEditForm.goodsname,
        category: this.goodsEditForm.category,
        id: this.editId
      };

      // 把新数据和老id一起发送给后端
      this.req
        .post("/commodity/commodityeditsave", params)
        .then(res => {
          // 接收后端数据
          let { code, reason } = res;
          // 判断
          if (code === 0) {
            // 弹成功提示
            this.$message({
              type: "success",
              message: reason
            });
            // 刷列表
            this.getCommodityListByPage();
          } else if (code === 1) {
            // 弹失败提示
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  created() {
    this.getCommodityListByPage();
  }
};
</script>
<style lang="less">
.repertory-manage {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
  .box-card {
    .text {
      hr {
        margin-top: 20px;
      }
      .el-col {
        .el-input {
          width: 200px;
        }

        .el-row {
          line-height: 40px;
        }
      }
    }
    .el-table__row {
      .cell {
        font-size: 10px;
      }
    }
    .el-pagination {
      margin-top: 10px;
    }
  }
}
</style>