<template>
  <div style="height: 100%; overflow: auto;">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="form">
      <el-form-item label="公告标题" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="textarea">
        <el-input v-model="form.textarea" type="textarea" :rows="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">发布公告</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return{
      form: {
        name: '',
        textarea: '',
      },
      rules:{
        name: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        textarea: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
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
</style>