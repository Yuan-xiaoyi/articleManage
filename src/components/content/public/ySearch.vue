<template>
  <div>
    <el-form
      class="order"
      :model="order" label-width="100px"
    >
      <el-form-item 
        v-for="(feild,index) in serchFeilds" :key="index"
        :label="feild.label" :prop="feild.prop">

        <el-input v-if="feild.type == 'input'" v-model="order[feild.prop]" clearable></el-input>

        <el-select v-if="feild.type == 'select'" v-model="order[feild.prop]" placeholder="请选择">
          <el-option
            v-for="item in feild.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        
        <el-select v-if="feild.type == 'nameSelect'" v-model="order[feild.prop]" placeholder="" filterable :filter-method="dataFilter(feild.prop, order[feild.prop], feild.options)" clearable>
          <el-option
            v-for="(writer,index) in feild.options" :key="index"
            :label="writer.username"
            :value="writer.value"
          ></el-option>
        </el-select>

        <el-date-picker
          v-if="feild.type == 'date'"
          v-model="order[feild.prop]"
          type="month"
          placeholder="选择时间"
          value-format="yyyy-MM"
        ></el-date-picker>

      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name: 'ySearch',
    props:{
      serchFeilds: []
      
    },
    data(){
      return{
        order: {},
        nameSelOptions: []
      }
    },
    created(){
      this.serchFeilds.forEach(e => {
        if(e.prop){
          if(e.type == 'date'){
            // let date = new Date()
            // let year = date.getFullYear() //年
            // let month = date.getMonth() + 1; //月
            // this.$set(this.order, e.prop, year + "-" + month)
          }else{
            this.$set(this.order, e.prop, '')
          }
        }
      });
      this.serchFeilds.forEach(e => {
        if(e.prop){
          if(e.type == 'nameSelect'){
            this.nameSelOptions = e.options
          }
        }
      });

      this.search()
    },
    methods:{
      search(){
        this.$emit("getSearch", this.order)
      },
      
      dataFilter(prop, val, options){
        this.$set(this.order, prop, val)
        console.log(options)
        if(val){
          options = this.nameSelOptions.filter(item => {
            if(!!~item.username.indexOf(val) || !!~item.username.toUpperCase().indexOf(val.toUpperCase())){
              return true
            }
          })
        }else{
          options = this.nameSelOptions
        }
      },
    }
}
</script>

<style scoped>
.order {
  text-align: left;
}
.order >>> .el-form-item{
  width: 324px;
  display: inline-block;
}
</style>