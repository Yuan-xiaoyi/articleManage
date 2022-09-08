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
              :type="scope.row[feild.prop] == 0 || scope.row[feild.prop] == 1 ? 'info' :
                     scope.row[feild.prop] == 6 ? 'success' :
                     scope.row[feild.prop] == 3 || scope.row[feild.prop] == 4 ? 'warning' : 'primary'
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
          
          <div v-if="feild.type && (feild.type === 'pay_status')">
            <el-tag
              :class="{status: feild.type === 'status&btn'}"
              :type="scope.row[feild.prop] == 0 ? 'info' : 'success'"
              disable-transitions
            >{{judge2(scope.row[feild.prop])}}</el-tag>
          </div>

          <div v-if="feild.type && feild.type === 'btn'">
            <el-button
              :type="feild.btnStyle"
              plain
              size="mini"
              @click="getBack(feild.btnEvent, scope.row)"
            >{{feild.btnLabel}}</el-button>
          </div>

          <div v-if="feild.type && feild.type === 'link'">
            <a href="javascript:0"
              @click="getBack(feild.btnEvent, scope.row)"
              style="text-decoration: none;"
            >{{feild.linkLabel}}</a>
          </div>

          <span v-if="feild.type && feild.type === 'textarea'" class="textarea">
            <el-input
              type="textarea"
              :rows="(scope.row[feild.prop].length / 30) <= 4 ? (scope.row[feild.prop].length / 30 + 1) : 4"
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
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="float: left;"
    ></el-pagination>

    <el-dialog
      title="详情页面"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      style="height: 80%; overflow-y: hidden"
    >
      <el-table
        :data="fileTableData"
        height="450px"
        style="width: 100%"
      >
        <el-table-column
          prop="text"
          label="文件说明"
          width="500"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="file"
          label="文件名"
          width="600"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="date"
          label="上传时间"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary" size="mini"
              @click="download(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 10px;">
        <!-- 写手 -->
        <el-button v-if="role == 'writer' && orderStatus == 2" type="primary" @click="acceptOrder">接收此单</el-button>
        <el-button v-if="role == 'writer' && (orderStatus == 4 || orderStatus == 3 || orderStatus == 5)" type="primary">上传文件</el-button>
        <el-button v-if="role == 'writer' && orderStatus != 6 && orderStatus != 5  && orderStatus != 2" type="danger">放弃此单（写手-接单12时之内）</el-button>
        
        <!-- 管理员 -->
        <el-button v-if="role == 'admin' && (orderStatus  == 4 || orderStatus  == 3)" type="primary">催单</el-button>
        <el-button v-if="role == 'admin' && orderStatus == 5" type="primary">确认此单</el-button>
        <el-button v-if="role == 'admin' && (orderStatus == 5 || orderStatus == 6)" type="primary">打回修改</el-button>
        <el-button v-if="role == 'admin' && orderStatus == 5" type="primary">完成此单</el-button>
        <el-button v-if="role == 'admin' && orderStatus == 6" type="primary">结算此单</el-button>
        <el-button v-if="role == 'admin'" type="danger" @click="deleteOrder">删除订单</el-button>
        
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import api_File from "../../../api/file"
import api_Order from "../../../api/order"
export default {
    name: 'yTable',
    props:{
      tableData: [],
      tableFeilds: [],
    },
    data(){
      return{
        options: this.$store.state.orderStatus.orderStatus,
        options2: this.$store.state.orderStatus.settlement,
        currentPage: 1,
        pagesizes: [10, 50, 100, 200, 500],
        pagesize: 10,
        total: 0,
        role: "",
        orderStatus: 0,
        order_id: '',
        order_sn: '',
        dialogVisible: false,
        fileTableData: []
      }
    },
    mounted(){
      this.total = this.tableData.length
      // this.showTableData = this.tableData
    },
    watch:{
      tableData(newVal, oldVal){
        if(newVal !== oldVal){
          this.total = newVal.length
        }
      }
    },
    methods:{
      acceptOrder(){
        api_Order.acceptOrder(this.order_sn).then(() =>{
          this.$message.success("成功接收此单！")
        }).catch(e => {
          this.$message.error(e.msg)
        })
      },



      judge(val){
        if(val == 0 || val == 1){
          return "已失效"
        }else{
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
        }
      },
      judge2(val){
        let item = undefined
        this.options2.forEach(e => {
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

      // 告诉父级刷新页面刷新订单表
      getNewOrder(){
        this.$emit("getNewOrder", this.pagesize, this.currentPage)
      },


      getBack(btnEvent, row){
        this.$emit("rowOperation", btnEvent, row)

        if(btnEvent == "detail"){
          this.role = this.$cookie.get('role')
          this.orderStatus = row.status
          this.order_id = row.id
          this.order_sn = row.orderSn,
          this.dialogVisible = true
          api_File.searchFile(this.order_id).then(res => {
            this.fileTableData = res.files
            console.log(res)
          }).catch(e => {
            this.$message.error(e.msg);
          })
        }
      },
      download(row){
        api_File.downloadOrderFile(row.file).then(res => {
          let blob = new Blob([res])
          console.log(blob)
          let downloadUrl = window.URL.createObjectURL(blob)
          let anchor = document.createElement('a')
          //anchor.style.display = "none";
          anchor.href = downloadUrl
          // 这里的filename 带有后缀，能决定文件的类型
          anchor.setAttribute("download", row.file);
          document.body.appendChild(anchor)
          anchor.click()
          document.body.removeChild(anchor)
        }).catch(e => {
          this.$message.error(e.msg);
        })
      },

      deleteOrder(){
        api_Order.deleteOrder([this.order_id]).then(() => {
          this.$message.success("删除成功！")
          this.dialogVisible = false
          this.getNewOrder()
        }).catch(e => {
          this.$message.error(e.msg)
        })
      },


      handleSizeChange(val) {
        this.pagesize = val
        // this.$emit("pageOperation", this.pagesize, this.currentPage)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        // this.$emit("pageOperation", this.pagesize, this.currentPage)
      },
      handleClose(){
        this.dialogVisible = false
      },

    }
}
</script>

<style scoped>
.status{
  margin-right:5px;
}

</style>