<template>
  <div style="height:calc(100vh - 116px);
              position: relative;
              width: 100%;
              display: flex;">
    <div class="side">
      <Sider @childMsg="showChildMsg" />
    </div>
    <div class="content">
      <component :is="componentName" ></component>
    </div>
  </div>
</template>

<script>
import Sider from './Sider.vue'
export default {
  name: 'Mainer',
  components: {
    Sider
  },
  data () {
    return {
      componentArr: [],
      componentName: ''
    }
  },
  methods:{
    showChildMsg(param){
      this.componentName = () => import(`../content/${param}`)
    }
  }

}
</script>

<style scoped>
  .side{
    float: left;
    width: 220px;
    height: 100%;
    background-color: rgb(84, 92, 100);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .content{
    width: calc(100% - 220px);
    padding: 15px 10px;
  }
</style>
