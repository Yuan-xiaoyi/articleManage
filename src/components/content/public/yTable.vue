<template>
  <div>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      height="calc(100% - 40px)"
      style="width: 100%; margin-bottom: 8px"
    >  
      <el-table-column
        v-for="(feild,index) in tableFeilds" :key="index"
        :label="feild.label"
        :min-width="feild.width ? feild.width : '100%'"
        align="center"
      >
        <template slot-scope="scope">

          <div v-if="feild.type && (feild.type === 'status&btn' || feild.type === 'status')" >
            <!-- <span>{{  }}</span> -->
            <el-tag
              :class="{status: feild.type === 'status&btn'}"
              :type="scope.row[feild.prop] == '5' ? 'success' :
                     scope.row[feild.prop] == '4' ? 'primary' : 
                     scope.row[feild.prop] == '3' ? 'warning' : 
                     scope.row[feild.prop] == '2' ? 'primary' : 'primary'
                    "
              disable-transitions
            >{{judge(scope.row[feild.prop])}}</el-tag>

            <el-button
              v-if="feild.type === 'status&btn'"
              :type="feild.btnStyle"
              plain
              size="mini"
              @click="getBack(feild.btnEvent, scope.row)"
            >{{feild.btnLabel}}</el-button>
          </div>

          <div v-if="feild.type && feild.type === 'btn'">
            <el-button
              :type="feild.btnStyle"
              plain
              size="mini"
              @click="getBack(feild.btnEvent, scope.row)"
            >{{feild.btnLabel}}</el-button>
          </div>

          <span v-if="feild.type && feild.type === 'textarea'" class="textarea">
            <el-input
              type="textarea"
              :rows="4"
              v-model="scope.row[feild.prop]"
              readonly
            ></el-input>
          </span>

          <span v-if="!feild.type">{{ scope.row[feild.prop] }}</span>

        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[50, 100, 200, 300, 500]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="float: left;"
    ></el-pagination>

  </div>
</template>

<script>
export default {
    name: 'yTable',
    props:{
      tableData: [],
      tableFeilds: []
    },
    data(){
      return{
        options: [
          {
            label: '待接单',
            value: '1'
          },{
            label: '未初稿',
            value: '2'
          },{
            label: '待修改',
            value: '3'
          },{
            label: '待确认',
            value: '4'
          },{
            label: '完成',
            value: '5'
          },
        ],
        currentPage: 1,
        pagesize: 50,
        total: 0,
      }
    },
    created(){
      this.total = this.tableData.length
      this.showTableData = this.tableData
    },
    methods:{
      judge(val){
        let item = undefined
        this.options.forEach(e => {
          if(e.value == val){
            item = e
          }
        })
        if(item && item.label){
          return item.label
        } else {
          return ""
        }
      },
      getBack(btnEvent, row){
        this.$emit("rowOperation", btnEvent, row)
      },
      
      handleSizeChange(val) {
        // this.$emit("pageOperation", val)
        this.pagesize = val
      },
      handleCurrentChange(val) {
        // this.$emit("pageOperation", val)
        this.currentPage = val
      }

    }
}
</script>

<style scoped>
.status{
  margin-right:5px;
}

</style>