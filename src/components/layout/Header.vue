<template>
  <div>
    <img src="../../assets/Header.png" alt="" class="headerImg">

    <span class="headTitle">
      一丈夫兮一丈夫,千生气志是良图
    </span>

    <el-popover
      placement="bottom"
      width="150"
      trigger="click"
    >  
      <div slot="reference" class="userHead">
        <div class="userImg1">
          <img :src="userHeadImg" alt="" class="userImg2">
        </div>
        <div class="userName">
          {{userName}}
        </div>
      </div>
      <div class="handleUser" @click="modify">修改个人信息</div>
      <div class="handleUser" @click="getOut">退出登录</div>
    </el-popover>
  </div>
</template>

<script>
// import img from "../../assets/HeaderTest.png";
export default {
  name: 'Header',
  data(){
    return{
      userInfo: {},
      userName: '游客模式',
      userHeadImg: require("../../assets/HeaderTest.png")
    }
  },
  mounted(){
    let userInfo = this.$cookie.get('userInfo') && JSON.parse(this.$cookie.get('userInfo'))
    if(userInfo){
      this.userInfo = userInfo
      if(userInfo.username)
        this.userName = userInfo.username
      if(userInfo.userHeadImg)
        this.userHeadImg = userInfo.userHeadImg
    }
  },
  methods: {
    handleUser(){

    },
    modify(){
      document.getElementsByClassName('el-popover')[0].style.display="none"

    },
    getOut(){
      document.getElementsByClassName('el-popover')[0].style.display="none"
      this.$router.push({name:'Login'}); // 只能用 name
      this.$cookie.set('token', '')
      this.$cookie.set('userInfo', '')
    }
  }
}
</script>

<style scoped>
.headerImg{
  width: 50px;
  height: 50px;
  float: left;
  margin: 8px 82px;
}
.headTitle{
  float: left;
  line-height: 64px;
  font-size: 20px;
  font-weight: bolder;
}
.userImg1{
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border: 1px solid var(--headerBgColor);
  border-radius: 50%;
  overflow: hidden;
}
.userImg2{
  width: 24px;
  height: 24px;
}
.userName{
  line-height: 26px;
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.userHead{
  float: right;
  margin: 20px 36px;
  cursor: pointer;
  display: inline-flex;
}
.handleUser{
  font-size: 15px;
  cursor: pointer;
  margin: 2px 0;
  padding-left: 12px;
}
.handleUser:hover{
  background: rgb(84, 92, 100);
  color: white;
}
</style>
