<template>
  <div style="height: 100%; overflow: auto;">
    <div v-if="!showDetail" style="width:100%;height: 100%">
      <el-row>
        <el-col v-for="(item, index) in colPages" :key="index" :sm="12" :lg="6">
          <div @click="goto(item)" class="item">
            <img :src="item.imgUrl" alt="" class="img" />
            <div class="title">{{item.title}}</div>
            <div class="subTitle">{{item.subTitle}}</div>
          </div>
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
    </div>
    <div v-else style="width:100%">
      <el-page-header @back="goBack" :content="detailTitle"></el-page-header>
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
      showDetail: false,
      detailTitle: '详情页面',
      colPages:[
        {
          imgUrl: require("../../../assets/totalScreen/searchWriters.png"),
          title: "查看写手",
          subTitle: "查看写手近期交付详情并进行结算",
          page: "searchWriters"
        },{
          imgUrl: require("../../../assets/totalScreen/createOrder.png"),
          title: "创建新单",
          subTitle: "创建订单需求并派发",
          page: "createOrder"
        },{
          imgUrl: require("../../../assets/totalScreen/addMember.png"),
          title: "注册新人",
          subTitle: "注册写手或其他身份成员",
          page: "register"
        },{
          imgUrl: require("../../../assets/totalScreen/notice.png"),
          title: "发布公告",
          subTitle: "发布近期公告",
          page: "notice"
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
    goto(item){
      this.componentName = () => import(`../../content/dispatcher/${item.page}`)
      this.detailTitle = item.title
      this.showDetail = !this.showDetail
    },
    goBack(){
      this.showDetail = false
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
  cursor: pointer;
}
.item:hover .img{
  transform: scale(1.2,1.2);
	transition: all 1s;
}
.img{
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
.el-page-header__content{
  font-size: 18px;
  color: #303133;
  font-weight: bold;
}
.el-page-header {
  margin: 10px 0px 20px;
}
</style>