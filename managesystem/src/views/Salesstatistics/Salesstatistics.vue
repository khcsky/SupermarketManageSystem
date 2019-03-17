<template>
  <div class="sales-statisics">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售数据统计</span>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="6">
            <el-row>
              <el-col :span="4">
                <div class="comword">时间:</div>
              </el-col>
              <el-col :span="20">
                <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="6">
            <el-row>
              <el-col :span="2">
                <div class="comword">----</div>
              </el-col>
              <el-col :span="20">
                <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="6">
            <el-row>
              <el-col :span="12">
                <el-select v-model="value8" filterable placeholder="销售情况统计">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-button type="success">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <div class="box" style="height: 400px;" id="box"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
// 引入moment
import moment from "moment";

export default {
  data() {
    return {
     
      value8: "",
      value1: ""
    };
  },
  methods: {

  },
  // 生命周期钩子函数 dom已经生成 适合操作dom
  mounted() {
    // 选中dom 使用echart初始化
    const myChart = this.echarts.init(document.getElementById("box"));

    // 发送ajax获取后端数据
    this.req
      .get("/account/salesdata")
      .then(res => {
        console.log(res);
        // 定义数据对象
        const sales = {
          ctimeArr: [],
          values: []
        };

        // 循环数组
        res.forEach(item => {
          // 循环后端数据 把时间和值获取出来放入对象
          sales.ctimeArr.push(moment(item.ctime).format("YYYY/MM/DD"));
          sales.values.push(item.values);
        });

        // 写报表配置
        const option = {
          tooltip: {
            // 提示
            show: true
          },
          legend: {
            // 图例
            data: ["销量"]
          },
          xAxis: [
            // x轴配置
            {
              type: "category",
              data: sales.ctimeArr // x轴
            }
          ],
          yAxis: [
            // y轴
            {
              type: "value"
            }
          ],
          series: [
            // 核心配置
            {
              name: "销量",
              type: "line",
              data: sales.values // y轴数据
            }
          ]
        };

        // 使用数据生成报表
        myChart.setOption(option);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="less">
.sales-statisics {
  .el-card {
    .text {
      .box{
        margin-top: 30px;
      }
      .comword {
        margin-top: 8px;
      }
    }
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
}
</style>