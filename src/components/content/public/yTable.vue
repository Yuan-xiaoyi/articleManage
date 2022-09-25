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
              :type="scope.row[feild.prop] == 0 ? '' : 'success'"
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

          <div v-if="feild.type && feild.type === 'link'"> <!-- 详情 -->
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

          <span v-if="feild.type && feild.type === 'writerName'">
            {{ judge3(scope.row[feild.prop]) }}
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
        height="430px"
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
        <el-button v-if="role == 'writer' && (orderStatus == 4 || orderStatus == 3)" size="small" type="primary" @click="uploadFile">上传文件</el-button>  
        <el-button v-if="role == 'writer' && orderStatus == 5" size="small" type="primary" @click="uploadFile">上传文件</el-button> 
        <el-button v-if="role == 'writer' && orderStatus != 6 && orderStatus != 5  && orderStatus != 2" type="danger" @click="giveUp">放弃此单(接单12小时之内)</el-button>
        
        <!-- 管理员 -->
        <el-button v-if="role == 'admin' && (orderStatus  == 4 || orderStatus  == 3)" type="primary" @click="hurry">催单</el-button>
        <el-button v-if="role == 'admin' && (orderStatus == 5 || orderStatus == 6)" type="warning" @click="backForModify">打回修改</el-button>
        <el-button v-if="role == 'admin' && orderStatus == 5" type="success" @click="endOrder">确认此单</el-button>
        <el-button v-if="role == 'admin' && orderStatus == 6" type="primary" @click="settlement">结算此单</el-button>
        <el-button v-if="role == 'admin'" type="danger" @click="deleteOrder">删除订单</el-button>
        
      </el-row>
    </el-dialog>
    
    
    <el-dialog
      :title="modifyVisible ? '修改要求' : '上传详情'"
      :close-on-click-modal="false"
      :visible="modifyVisible || uploadVisible"
      width="50%"
      :before-close="handleClose2"
      style="height: 80%; overflow-y: hidden;margin-top: 15vh"
      class="uploadDialog"
    >
      <div style="margin-bottom: 10px;width: 100%;display: inline-flex;">
        <span>描述文本：</span>
        <el-input type="textarea" v-model="text" :rows="4" style="width:90%"></el-input>
      </div>
      <el-upload
        class="upload-demo"
        action=""
        :http-request="uploadMehod"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        style="float: left; margin-bottom: 10px; width: 100%"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传doc/docx/pdf/txt/zip/rar文件</div>
      </el-upload>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="uploadFileConfirm">{{modifyVisible ? "上传并反馈回写手" : "上传并提交至管理员"}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api_File from "../../../api/file"
import api_Order from "../../../api/order"
import api_User from "../../../api/user"
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
        order_status: 0,
        text: '',
        isForConfirm: false,
        order_sn: '',
        dialogVisible: false,
        uploadVisible: false,
        modifyVisible: false,
        fileTableData: [],
        fileList: [],
        writerList: []
      }
    },
    created(){
      api_User.getUserList().then(res => {
        this.writerList = res.page.list
      })
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
      uploadFile(){
        this.uploadVisible = true;
      },
      giveUp(){},
      hurry(){},
      backForModify(){
        this.modifyVisible = true;
      },
      endOrder(){
        let pOrder = {     
          id: this.order_id,
          status: 6
        }
        api_Order.updateOrderStatus(pOrder).then(() => {
          this.$message.success("确认成功")
          this.getNewOrder()
          this.dialogVisible = false
        }).catch(e => {
          this.$message.error(e.msg)
        })
        
      },
      settlement(){
        let pOrder = {     
          id: this.order_id,
          settlement: 1
        }
        api_Order.updateOrderStatus(pOrder).then(() => {
          this.$message.success("结算完成")
          this.getNewOrder()
          this.dialogVisible = false
        }).catch(e => {
          this.$message.error(e.msg)
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

      
      uploadFileConfirm(){
        if(this.fileList.length > 0 && this.text != ""){
          let param = {
            order_id: this.order_id,
            text: this.text
          }
          // 新增文件记录(传入order_id)
          api_File.addFileDetail(param).then(result => {
            // 有文件，成功后调用文件上传接口
            let formData = new FormData();
            formData.append("file", this.fileList[0]);
            api_File.uploadOrderFile({id: result.id, formData: formData}).then(() => {
              this.searchFile();
              if(this.uploadVisible){
                if(this.order_status != 5){
                  // 更改订单状态
                  // 若处于待确定状态的订单则不需要
                  let pOrder = {     
                    id: this.order_id,
                    status: 5 
                  }
                  api_Order.updateOrderStatus(pOrder).then(() => {
                    this.uploadVisible = false
                    this.dialogVisible = false
                    this.$message.success("上传文件并提交管理员成功");
                    this.getNewOrder()
                  }).catch(e => {
                    this.$message.error(e.msg)
                  })
                }else{
                  this.dialogVisible = false
                  this.$message.success("上传文件成功");
                }
              }
              if(this.modifyVisible){
                let pOrder = {
                  id: this.order_id,
                  status: 3
                }
                api_Order.updateOrderStatus(pOrder).then(() => {
                  this.modifyVisible = false
                  this.dialogVisible = false
                  this.$message.success("反馈写手成功")
                  this.getNewOrder()
                }).catch(e => {
                  this.$message.error(e.msg)
                })
              }
            }).catch(error => {
              this.$message.error(error.msg)
            })
          }).catch(er => {
            this.$message.error(er.msg)
          })
        }else{
          this.$message.info("必须输入描述文本和上传文件！")
        }
      },
      cancel(){
        this.uploadVisible = false;
        this.modifyVisible = false
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
          this.order_status = row.status,
          this.order_sn = row.orderSn,
          this.dialogVisible = true
          this.searchFile();
        }
      },
      searchFile(){
        api_File.searchFile(this.order_id).then(res => {
          this.fileTableData = res.files
          console.log(res)
        }).catch(e => {
          this.$message.error(e.msg);
        })
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
      judge3(val){
        if(val){
          let item = this.writerList.find(writer => writer.userId == val)
          if(item != undefined){
            return item.username
          }else{
            return ""
          }
        }else{
          return ""
        }
      },

      // 上传五连
      uploadMehod(params){
        console.log('http-request', params);
        this.fileList[0] = params.file
      },
      handleRemove(file, fileList) {
        console.log('on-remove', file, fileList);
      },
      handlePreview(file) {
        console.log('on-preview', file);
      },
      beforeUpload(file) {
        // 限制文件格式类型
        const isDocx = file.name.split('.')[1] === 'docx'
        const isDoc = file.name.split('.')[1]==='doc'
        const isPdf = file.name.split('.')[1]==='pdf'
        const isTxt = file.name.split('.')[1]==='txt'
        const isZip = file.name.split('.')[1]==='zip'
        const isRar = file.name.split('.')[1]==='rar'

        if (!isDocx && !isDoc && !isPdf && !isZip && !isRar && !isTxt) {
          this.$message.error('上传文档只能是 doc/docx/pdf/zip/rar/txt 格式!');
        }
        return isDocx || isDoc || isPdf || isZip || isRar || isTxt;
      },
      handleExceed(files, fileList) {
        console.log('on-exceed', files, fileList)
        this.$message.warning(`当前限制上传 1 个文件，请删除后再上传`);
      },
      handleSuccess(res, file) {
        console.log(res,file)
        this.fileList = URL.createObjectURL(file.raw);
      },
      beforeRemove(file) {
        console.log(file)
        this.fileList = []
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
      handleClose2(){
        this.uploadVisible = false
        this.modifyVisible = false
      },

    }
}
</script>

<style scoped>
.status{
  margin-right:5px;
}
.uploadDialog >>> .el-dialog__footer{
  text-align: center;
  margin-top: 55px;
}

</style>