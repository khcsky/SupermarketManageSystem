<template>
    <div class="system-news">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>系统信息</span>
            </div>
            <div class="text item">
                <!-- 信息提示 -->
                 <el-alert
                    title="商品总数5。已销售的总金额:890.00。库存157.63"
                    type="info"
                    left
                    show-icon>
                </el-alert>
                <br>
                 <el-alert
                    title="导入数据"
                    type="info"
                    left
                    show-icon>
                </el-alert>
                 <br>
                <el-row :gutter="20">
                    <!-- 销售排行 -->
                    <el-col :span="12">
                        <el-card class="boxtwo-card">
                            <div slot="header" class="clearfix">
                                <span>销售排行</span>
                                 
                            </div>
                            <div class="text item">
                                 <el-table
                                        :data="salesSort"
                                        style="width: 100%"
                                        :row-class-name="tableRowClassName"
                                        >
                                        <el-table-column prop="goodsname" label="商品名称" >
                                        </el-table-column>

                                        <el-table-column prop="salesvolume"  label="销量" >
                                        </el-table-column>
                                    </el-table>
                            </div>
                       </el-card>
                    </el-col>
                    <!-- 商品缺货 -->
                    <el-col :span="12">
                         <el-card class="boxthr-card">
                            <div slot="header" class="clearfix">
                                <span>缺货的商品</span>
                                 
                            </div>
                            <div class="text item">
                                 <el-table
                                        :data="goodsoutofstock"
                                        style="width: 100%"
                                        :row-class-name="tableRowClassName"
                                       >
                                        <el-table-column prop="goodsname" label="商品名称" >
                                        </el-table-column>

                                        <el-table-column prop="reperpory"  label="库存" >
                                        </el-table-column>
                                        <el-table-column label="操作">                                   
                                      
                                           <el-button type="text">入库</el-button>
                                                                  
                                </el-table-column>
                                    </el-table>
                            </div>
                       </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
                 //销量排行数据
                salesSort:[
                     {
                         goodsname:'海飞丝去屑洗发水',
                         salesvolume:8
                     },
                     {
                         goodsname:'茅台酒',
                         salesvolume:6
                     },
                     {
                         goodsname:'龙凤呈祥',
                         salesvolume:4
                     },
                ],
        goodsoutofstock:[
                    {
                        goodsname:'优乐美',
                        reperpory:0
                    },
                    {
                        goodsname:'冰红茶',
                        reperpory:0
                    },
                ]
        }

    },
    methods: {
         tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }else{
            return 'add'
        }
        
      }
    }
    
}
</script>
<style lang="less">
    @import './Systemnews.less';
</style>