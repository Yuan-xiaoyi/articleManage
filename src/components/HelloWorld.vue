<template>
  <div class="helloWorld" style="display: block;height:100%">
    <div class="header">
      <Header />
    </div>
    <div class="layout">
      <div class="main">
        <Mainer />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>

  </div>
</template>

<script>
import Header from './layout/Header.vue'
import Mainer from './layout/Mainer.vue'
import Footer from './layout/Footer.vue'
// import api from '../api/demo/user';
export default {
  name: 'HelloWorld',
  components: {
    Header, Mainer, Footer
  },
  created(){
    // let id = this.$route.params.id
  }

}
</script>

<style scoped>
  .helloWorld{
    padding: 0;
    margin: 0;
    height: 100%;
    width:100%;
    overflow: hidden;
    background:rgba(0,0,0,0.8);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .header{
    text-align: center;
    height: 66px;
    color: white;
    background-color: var(--headerBgColor)

  }

  .layout {
    /* width: calc(100% - 400px); */
    height: calc(100% - 66px);
    overflow-y: auto;
    overflow-x: hidden;
    /* margin:0 200px; */
    background-color: #CCE8CF;
  }
  .main{
    display: block;
    width: 100%;
    min-height: calc(100% - 50px);
    overflow: auto;
    font-size: var(--fontSize);
    color: var(--fontColor);
  }
  .footer{
    text-align: center;
    width: 100%;
    height: 50px;
    background: rgba(255,255,255,0.3)
    /* radial-gradient(lightgrey, gray); */
  }
  
</style>
