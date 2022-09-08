<template>
  <div class="footerText">
    <!--  不然绝粒升天衢，不然鸣珂游帝都。 ——【唐】李泌 -->
    『 {{footJson.hitokoto}} 』 —— 《{{footJson.creator}}》
    <i class="el-icon-refresh-right" @click="getFooterJson"
      style="cursor: pointer;  font-weight: 600; font-size: 18px;
             float: right;line-height: 50px;margin-right: 16px;"
    ></i>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Footer',
  data(){
    return{
      footJson:{}
    }
  },
  created(){
    this.getFooterJson();
  },
  methods:{
    getFooterJson(){
      axios.get('https://v1.hitokoto.cn/?encode=json').then(res => {
        this.footJson = res.data
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.footerText{
  line-height: 50px;
  font-family: cursive;
  font-size: 19px;
  font-weight: bolder;
}
</style>
