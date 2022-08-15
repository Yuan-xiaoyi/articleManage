<template>
  <div style="height: 100%; overflow: auto;">
    <h3>创建新单</h3>
    
    <el-form ref="form"  :model="form" label-width="80px" class="form">
      <el-form-item label="稿件名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="字数" prop="wordsNum">
        <el-input
          v-model="form.wordsNum"
          type="number"
          min="0"
          max="999999"
          onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          class="numberInput"
        ></el-input>
      </el-form-item>
      <el-form-item label="交稿时间" prop="submitDate">
        <el-date-picker
          v-model="form.submitDate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="textarea">
        <el-input v-model="form.textarea" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="需求文档" prop="textarea">
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
          <div slot="tip" class="el-upload__tip">只能上传doc/docx/pdf文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="派单至" prop="textarea">
        <el-select v-model="form.writer" placeholder="" filterable :filter-method="dataFilter" clearable>
          <el-option
            v-for="(writer,index) in options" :key="index"
            :label="writer.username"
            :value="writer.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">创建并派单</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "../../../api/demo/user"
export default {
  name:"createOrder",
  data(){
    return{
      form: {
        name: '',
        wordsNum: '',
        submitDate: '',
        textarea: '',
        file: '',
        writer: ''
      },
      options: [],
      writerList: [],
      fileList: []
    }
  },
  created(){
    let param = {"page":1 ,"limit": 10000000000}
    api.getUserList(param).then(res => {
      this.writerList = res.page.list
      this.options = [{value: '',username: '所有写手'}, ...this.writerList]
    }).catch(e => {
      this.$message.error(e.msg)
    })
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form, this.fileList)
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
          }
        })
      }else{
        this.options = [{value: '',username: '所有写手'}, ...this.writerList]
      }
    },
    
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

      if (!isDocx && !isDoc && !isPdf) {
        this.$message.error('上传文档只能是 doc/docx/pdf 格式!');
      }
      return isDocx || isDoc || isPdf;
    },
    handleExceed(files, fileList) {
      console.log('on-exceed', files, fileList)
      this.$message.warning(`当前限制上传 1 个文件，请删除后再上传`);
    },
    handleSuccess(res, file) {
      this.fileList = URL.createObjectURL(file.raw);
    },
    beforeRemove(file) {
      console.log('before-remove', file)
      // return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>

<style scoped>
.form{    
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 500px;
}
.el-input{
  width: 100%;
}
.el-select{
  width: 100%;
}

/* .numberInput input::-webkit-outer-spin-button,
.numberInput input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.numberInput input[type="number"] {
    -moz-appearance: textfield;
} */
</style>