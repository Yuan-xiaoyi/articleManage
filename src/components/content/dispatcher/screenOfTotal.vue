<template>
  <div style="height: 100%; overflow: auto;">
    <el-row>
      <el-col v-for="(item, index) in colPages" :key="index" :sm="12" :lg="6">
        <div @click="goto('sad')" class="item">
          <i class="icon" :class="item.icon"></i>
          <div class="title">{{item.title}}</div>
          <div class="subTitle">{{item.subTitle}}</div>
        </div>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="warning" title=""
        subTitle="请根据提示进行操作">
        </el-result>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="error" title="" subTitle="请根据提示进行操作">
        </el-result>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-result icon="info" title="" subTitle="请根据提示进行操作">
        </el-result>
      </el-col>
    </el-row>

    <el-table        
      :data="allOrderData"
      height="calc(100% - 96px)"
    >
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
    </el-table>

    <div style="width:100%;height: 1000px">
      <el-page-header @back="goBack" content="详情页面"></el-page-header>
      <div>
        <component :is="componentName" ></component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'screenOfTotal',
  data(){
    return{
      colPages:[
        {
          icon: "el-icon-user-solid",
          title: "查看写手",
          subTitle: "查看写手近期交付详情",
          page: ""
        },{
          icon: "el-icon-user-solid",
          title: "注册新人",
          subTitle: "查看写手近期交付详情",
          page: ""
        },{
          icon: "el-icon-user-solid",
          title: "发布公告",
          subTitle: "查看写手近期交付详情",
          page: ""
        },{
          icon: "el-icon-user-solid",
          title: "创建新单",
          subTitle: "查看写手近期交付详情",
          page: ""
        }
      ],
      allOrderData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
      componentName:""
    }
  },
  methods:{
    goto(str){
      this.componentName = () => import(`../../content/dispatcher/${str}`)
    },
    goBack(){

    }
  }
}
</script>

<style scoped>
.item{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  padding: 40px 30px;
}
.icon{
  width: 64px;
  height: 64px;
}
.title{
  margin-top: 20px;
  font-size: 20px;
  color: #303133;
  line-height: 1.3;
}
.subTitle{
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.3;
}
</style>