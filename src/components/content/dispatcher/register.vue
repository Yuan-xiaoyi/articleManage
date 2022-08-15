<template>
  <div style="height: 100%; overflow: auto;">
    <h3>注册新人</h3>

    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="form">
      <el-form-item label="账户名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="账户密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="账户身份" prop="identity">
        <el-radio-group v-model="form.identity">
          <el-radio label="admin" >管理员</el-radio>
          <el-radio label="writer">写手</el-radio>
          <el-radio label="TP">第三方</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="账户头像" prop="image">
        <!-- <el-upload
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
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload> -->
        <el-select 
          v-model="form.image"
          placeholder=""
          @change="changeSelection(form.image)"
          ref="select"
          style="width: 60px;float: left" 
        >
          <el-option
            v-for="(item,index) in images" :key="index"
            :value="item.value">
            <img :src="item.value" alt="" style="width: 20px;height: 20px;margin-top: 7px">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">创建账户</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const validateEmail = function validateEmail(rule, value, callback) {
  const emailReg = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})$/ // eslint-disable-line
  if (!value) {
    return callback()
  }
  setTimeout(() => {
    if (!emailReg.test(value)) {
      return callback(new Error('邮箱格式错误'))
    } else {
      callback()
    }
  }, 100)
}
export default {
  name: 'register',
  data() {
    return {
      form: {
        name: '',
        password: '',
        identity: '',
        mobile: '',
        email: '',
        image: '',
      },
      rules:{
        name: [
          { required: true, message: '请输入账户', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '必须选择身份信息', trigger: 'change' }
        ],
        mobile: [{ min:11, max:11, message: '手机号为11位', trigger: 'change' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/
              console.log(passwordreg.test(value))
              if (!value) {
                return callback()
              }else if (!passwordreg.test(value)) {
                callback(
                  new Error(
                    '请输入正确的手机号码'
                  )
                )
              } else {
                callback()
              }
            }
          }
        ],
        email: [
          { required: false, message: '邮箱必填', trigger: 'blur' },
          { validator: validateEmail, trigger: "blur" }
        ]
      },
      images: [
        {
          value: require("../../../assets/M1.png")
        },
        {
          value: require("../../../assets/M2.png")
        },
        {
          value: require("../../../assets/F1.png")
        },
        {
          value: require("../../../assets/F2.png")
        }
      ],
      fileList: []
    }
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
    //关系方向下拉框改变事件
    changeSelection(image){
      for(let index in this.images){
        let aa = this.images[index];
        let value = aa.value;
        if(image === value ){
          this.$refs['select'].$el.children[0].children[0].setAttribute('style',
            'background:url('+ aa.value +') no-repeat;color:#fff;text-indent: -9999px;background-position: 20%;background-size: 24px 24px;');
        }
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
      const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/JPG' || file.type === 'image/PNG';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
</style>