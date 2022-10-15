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
        :data="allWriterData"
        height="calc(100% - 96px)"
      >
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column label="在线状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status == 1 ? 'success': 'warning'"
              disable-transitions
            >{{ scope.row.status == 1 ? "上班" : "休假"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="期望接单数量">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="delUser(scope.row)">删除写手</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else style="width:100%" class="detailPage">
      <el-page-header @back="goBack" :content="detailTitle"></el-page-header>
      <div>
        <component :is="componentName" ></component>
      </div>
    </div>
  </div>
</template>

<script>
import api_User from "../../../api/user"
export default {
  name: 'screenOfTotal',
  data(){
    return{
      showDetail: false,
      detailTitle: '详情页面',
      colPages:[
        {
          imgUrl: require("../../../assets/totalScreen/searchWriters.png"),
          title: "接单详情",
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
      allWriterData: [],
      componentName:""
    }
  },
  created(){
    this.searchAllUsers()
  },
  methods:{
    goto(item){
      this.componentName = () => import(`../../content/dispatcher/${item.page}`)
      this.detailTitle = item.title
      this.showDetail = !this.showDetail
    },
    goBack(){
      this.showDetail = false
    },
    searchAllUsers(){
      api_User.getUserList().then(res => {
        this.allWriterData = res.page.list.map(e => {
          if(e.role == "writer"){
            return e
          }
        })
        this.allWriterData = this.allWriterData.filter(ele=>{return ele!=undefined})
      }).catch(e => {
        this.$message.error(e.msg)
      })
    },
    delUser(row){
      api_User.delUser(row.userId).then(res => {
        this.$message.success(res.msg)
        this.searchAllUsers()
      }).catch(e => {
        this.$message.error(e.msg)
      })
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
.detailPage >>> .el-page-header__content{
  font-size: 18px;
  color: #303133;
  font-weight: bolder;
}
.el-page-header {
  margin: 10px 0px 20px;
}
</style>