<template>
  <div style="height: 100%; overflow: auto;">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" class="form">
      <el-form-item label="稿件名" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="字数" prop="wordsNum">
        <el-input
          v-model="form.wordsNum"
          min="0"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          class="numberInput"
        ></el-input>
      </el-form-item>
      <el-form-item label="订单价格(元)" prop="orderPrice">
        <el-input v-model="form.orderPrice" min="0"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
      </el-form-item>
      <el-form-item label="派给写手价格(元)" prop="writerMoney">
        <el-input v-model="form.writerMoney" min="0"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
      </el-form-item>
      <el-form-item label="订单来源" prop="orderSource">
        <el-input v-model="form.orderSource"></el-input>
      </el-form-item>
      <el-form-item label="订单来源号" prop="sourceId">
        <el-input v-model="form.sourceId"></el-input>
      </el-form-item>
      <el-form-item label="交稿时间" prop="finishDate">
        <el-date-picker
          v-model="form.finishDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="派单至" prop="writer">
        <el-select v-model="form.writer" placeholder="" filterable :filter-method="dataFilter" clearable>
          <el-option
            v-for="(writer,index) in options" :key="index"
            :label="writer.username"
            :value="writer.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="textarea" style="width: 80%;">
        <el-input v-model="form.textarea" type="textarea" :rows="6"></el-input>
      </el-form-item>
      <el-form-item label="需求文档" prop="textarea" style="width: 80%;">
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
          style="float: left;"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传doc/docx/pdf/txt/zip/rar文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item class="footer">
        <el-button type="primary" :loading="loading" @click="onSubmit('form')">创建并派单</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api_File from "../../../api/file"
import api_Order from "../../../api/order"
import api_User from "../../../api/user"
export default {
  name:"createOrder",
  data(){
    return{
      form: {
        title: '',
        wordsNum: '',
        finishDate: '',
        textarea: '',
        // file: '',
        orderPrice: '',
        writerMoney: '',
        orderSource: '',
        sourceId: '',
        writer: ''
      },
      rules:{
        title: [
          { required: true, message: '请输入稿件名', trigger: 'blur' }
        ],
        wordsNum: [
          { required: true, message: '请输入稿件要求字数', trigger: 'blur' },
          {"pattern": /^[0-9]*$/,"message": "只能输入正整数"}
        ],
        finishDate: [
          { required: true, message: '请选择交稿日期', trigger: 'change' }
        ],
        orderPrice: [
          { required: true, message: '请输入订单价格', trigger: 'blur' }
        ],
        writerMoney: [
          { required: true, message: '请输入派给写手价格', trigger: 'blur' }
        ],
        // orderSource:  [
        //   { required: true, message: '请输入订单来源', trigger: 'blur' }
        // ],
        // sourceId:  [
        //   { required: true, message: '请输入订单来源号', trigger: 'blur' }
        // ]
      },
      options: [],
      writerList: [],
      fileList: [],
      loading: false
    }
  },
  created(){
    let param = {"page":1 ,"limit": 10000000000}
    this.$set(this.form, "finishDate", this.getNowTime());
    api_User.getUserList(param).then(res => {
      this.writerList = res.page.list.map(e => {
        let item = JSON.parse(JSON.stringify(e))
        this.$set(item, "value", e.username)
        if(item.role == "writer"){
          return item
        }
      })
      this.writerList = this.writerList.filter(ele=>{return ele!=undefined})
      this.options = [{userId: '',username: '所有写手'}, ...this.writerList]
      console.log(this.options)
    }).catch(e => {
      this.$message.error(e.msg)
    })
  },
  methods: {
    getNowTime() {
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      let date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      return `${year}-${month}-${date}`;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          let param = {
            userId: this.form.writer,
            title: this.form.title,
            wordsnum: this.form.wordsNum,
            deadline: this.form.finishDate,
            remark: this.form.textarea,
            price: parseInt(this.form.orderPrice),
            source: this.form.orderSource,
            sourceId: this.form.sourceId,
            money: parseInt(this.form.writerMoney),
            status: 2
          }
          // param.finishDate = this.$filter.formatDate(param.finishDate)

          // 创建订单记录
          api_Order.createOrder(param).then(res => {
            let param2 = {
              order_id: res.id,
              text: param.title
            }
            // 新增文件记录(传入order_id)
            api_File.addFileDetail(param2).then(result => {
              // 有文件，成功后调用文件上传接口
              if(this.fileList.length > 0){
                let formData = new FormData();
                formData.append("file", this.fileList[0]);
                api_File.uploadOrderFile({id: result.id, formData: formData}).then(() => {
                  this.$message.success("创建并已成功派单！")
                  this.loading = false
                }).catch(error => {
                  this.loading = false
                  this.$message.error(error.msg)
                  // 上传文件失败则要删除订单 和 文件记录
                  api_Order.deleteOrder([res.id]).then({})
                })
              }else{
                this.loading = false
                this.$message.success("创建并已成功派单！")
              }
            }).catch(er => {
              this.loading = false
              this.$message.error(er.msg)
              // 新增文件记录失败则要删除订单
              api_Order.deleteOrder([res.id]).then({})
            })
          }).catch(e => {
            this.loading = false
            this.$message.error(e.msg)
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    dataFilter(val){
      this.form.writer = val
      if(val){
        this.options = this.writerList.filter(item => {
          if(!!~item.username.indexOf(val) || !!~item.username.toUpperCase().indexOf(val.toUpperCase())){
            return true
          }else{
            this.form.writer = ""
            this.options = [{userId: '',username: '所有写手'}, ...this.writerList]
          }
        })
      }else{
        this.options = [{userId: '',username: '所有写手'}, ...this.writerList]
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
    }
  }
}
</script>

<style scoped>
.form{    
  position: relative;
}
.form >>> .el-form-item{
  width: 40%;
  display: inline-block;
}
.el-input{
  width: 100%;
}
.el-select{
  width: 100%;
  /* float: left; */
}
.footer{
  width: 80% !important;
  text-align: center;
}
/* .numberInput input::-webkit-outer-spin-button,
.numberInput input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.numberInput input[type="number"] {
    -moz-appearance: textfield;
} */
</style>