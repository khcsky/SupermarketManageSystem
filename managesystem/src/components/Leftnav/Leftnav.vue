<template>
    <div class="left-nav">
             
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router>
            <h5>LOGO &ensp;华联超市</h5>
               <el-submenu v-for="(menu, index) in menuData" :key="index" :index="(index + 1) + ''">
                <template slot="title">
                    <span class="icon iconfont" v-html="menu.icon_code"></span>
                    <span>{{ menu.menuTitle }}</span>
                </template>
                <el-menu-item :index="subMenu.path" v-for="(subMenu, index) in menu.children" :key="index">
                    {{ subMenu.subMenuTitle }}
                </el-menu-item>
            </el-submenu>
               <!-- <el-submenu index="2">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>账号管理</span>
                </template>             
                    <el-menu-item index="2-1">账号管理</el-menu-item>
                    <el-menu-item index="2-2">账号添加</el-menu-item>  
                    <el-menu-item index="2-3">密码修改</el-menu-item>                          
               </el-submenu>
               <el-submenu index="3">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
                </template>             
                    <el-menu-item index="3-1">商品管理</el-menu-item>
                    <el-menu-item index="3-2">商品添加</el-menu-item>                           
               </el-submenu>
               <el-submenu index="4">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>统计管理</span>
                </template>             
                    <el-menu-item index="4-1">销售统计</el-menu-item>
                    <el-menu-item index="4-2">进货统计</el-menu-item>                           
               </el-submenu>
               <el-submenu index="5">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>会员管理</span>
                </template>             
                    <el-menu-item index="5-1">账号管理</el-menu-item>
                    <el-menu-item index="5-2">添加账号</el-menu-item>                           
               </el-submenu>
               <el-submenu index="6">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>进货管理</span>
                </template>             
                    <el-menu-item index="6-1">库存管理</el-menu-item>
                    <el-menu-item index="6-2">添加库存</el-menu-item>                           
               </el-submenu>
               <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>出货管理</span>
                </template>             
                    <el-menu-item index="7-1">销售列表</el-menu-item>
                    <el-menu-item index="7-2">商品出库</el-menu-item>  
                     <el-menu-item index="7-3">商品退货</el-menu-item>                           
               </el-submenu>
             -->
            </el-menu>

    </div>
</template>
<script>
export default {
    data(){
        return{
            //导航数据
            menuData:[
                //系统管理
                {
                    menuTitle:'系统管理',
                    icon_code:'&#xe641',
                    roles: ['admin', 'normal'],
                    children: [
                        {
                            path: '/index',
                            subMenuTitle: '系统信息'
                        }
                    ]
                },
                //账号管理
                {
                    menuTitle:'账号管理',
                    icon_code:'&#xe62c',
                     roles: ['admin'],
                    children: [
                        {
                            path: '/index/accountmanage',
                            subMenuTitle: '账号管理'
                        },
                        {
                            path: '/index/accountadd',
                            subMenuTitle: '账号添加'
                        },
                        {
                            path: '/index/passwordmodfiy',
                            subMenuTitle: '密码修改'
                        },
                    ]
                },
                //商品管理
                {
                    menuTitle:'商品管理',
                     roles: ['admin', 'normal'],
                    icon_code:'&#xe63a',
                    children: [
                        {
                            path: '/index/commoditymanage',
                            subMenuTitle: '商品管理'
                        },
                         {
                            path: '/index/commodityadd',
                            subMenuTitle: '商品添加'
                        },
                    ]
                },
                //统计管理
                {
                    menuTitle:'统计管理',
                    icon_code:'&#xe607',
                     roles: ['admin', 'normal'],
                    children: [
                        {
                            path: '/index/salesstatistics',
                            subMenuTitle: '销售统计'
                        },
                         {
                            path: '/index/stockstatistics',
                            subMenuTitle: '进货统计'
                        }
                    ]
                },
                //进货管理
                {
                    menuTitle:'进货管理',
                    icon_code:'&#xe60b',
                     roles: ['admin', 'normal'],
                    children: [
                        {
                            path: '/index/repertorymanage',
                            subMenuTitle: '库存管理'
                        },
                         {
                            path: '/index/repertoryadd',
                            subMenuTitle: '添加库存'
                        }
                    ]
                },
                //出货管理
                {
                    menuTitle:'出货管理',
                    icon_code:'&#xe634',
                    roles: ['admin', 'normal'],
                    children: [
                        {
                            path: '/index/saleslist',
                            subMenuTitle: '销售列表'
                        },
                        {
                            path: '/index/outboundgoods',
                            subMenuTitle: '销售出库'
                        },
                        {
                            path: '/index/returngoods',
                            subMenuTitle: '销售退货'
                        }
                    ]
                },
                //会员管理
                 {
                    menuTitle:'会员管理',
                    icon_code:'&#xe64f',
                     roles: ['admin', 'normal'],
                    children: [
                        {
                            path: '/index/memberadd',
                            subMenuTitle: '账号添加'
                        },
                        {
                            path: '/index/membermanage',
                            subMenuTitle: '账号管理'
                        },
                    ]
                },
            ]
        }
    },
    methods: {
        
    },created() {
           // 获取当前登录用户的角色
        this.req.get('/login/getrole')
            .then(res => {
                // 获取权限数组
                let { roles } = res;

                console.log(res);
                
                // 定义一个权限菜单
                let permissionMenu = [];

                // 循环现有菜单
                this.menuData.forEach(item => {
                    // 循环角色数组
                    roles.forEach(v => {
                        if (item.roles.includes(v)) { // 如果item的roles中包含后端返回的角色
                            permissionMenu.push(item)
                        }
                    })
                })
                
                // 把权限菜单赋值给 menuData
                this.menuData = permissionMenu;
            })
            .catch(err => {

            })
    }
    
}
</script>
<style lang="less">
   @import url('./leftnav.less');
</style>