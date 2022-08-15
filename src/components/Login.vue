<template>
<div class="test">
  <div class="login">
    <div style="display:flex">
      <div class="title">登录</div> 
      <!--  :class="{active: active}"  @click="active = !active" -->
      <!-- <div class="title" :class="{active: !active}" @click="active = !active"
        style="border-left:1px solid var(--borderColor)">注册</div> -->
    </div>

    <el-form
      class="inner" ref="form" :rules="rules"
      :model="form" label-width="65px"
      :style="{'display': active ? 'block' : 'none'}"
      style="margin-top: 44px"
    >
      <el-form-item label="账户" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-row :gutter="20">
          <el-col :span="11" style="padding-left: 0">
            <el-input v-model="form.captcha">
            </el-input>
          </el-col>
          <el-col :span="9" class="login-captcha">
            <img :src="captchaPath" @click="getCaptcha()" alt=""
              style="width: 90px;height: 40px;">
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <button type="primary" @click.prevent="login('form')">登录</button>
      </el-form-item>
    </el-form>
    
    <el-form
      class="inner" ref="form2" :rules="rules"
      :model="form2" label-width="52px"
      :style="{'display': !active ? 'block' : 'none'}"
      style="margin-top: 42px"
    >
      <el-form-item label="账户" prop="username">
        <el-input v-model="form2.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form2.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form2.email"></el-input>
      </el-form-item>
      <el-form-item>
        <button type="primary" @click.prevent="register('form2')">注册</button>
      </el-form-item>
    </el-form>

  </div>
</div>
</template>

<script>
const config = require('../../config/index')
import api from '../api/demo/user';
import { getUUID } from '../utils/index'
export default {
  name: "Login",
  data() {
    return {
      active: true,
      form: {
        uuid: '',
        username: '',
        password: '',
        captcha: ''
      },
      captchaPath: '',
      form2: {
        username: '',
        password: '',
        email: '',
      },
      rules:{
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha () {
      this.form.uuid = getUUID()
      this.captchaPath = config.BASE_URL + `captcha.jpg?uuid=${this.form.uuid}`
      // api.adornUrl({uuid: this.form.uuid}).then(res => {
      //   console.log(res);
      // }).catch(e => {
      //   this.$message.error(e.message);
      // })
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            'username': this.form.username,
            'password': this.form.password,
            'uuid': this.form.uuid,
            'captcha': this.form.captcha
          }
          api.login(param).then(res => {
            // 设置token
            this.$cookie.set('token', res.token)
            api.getUserInfo().then(result =>{
              this.$message({
                message: '登陆成功！',
                type: 'success'
              });
              // 设置userInfo
              this.$cookie.set('role', res.role)
              this.$cookie.set('userInfo', JSON.stringify(result.user))
              this.$router.push({name:'HelloWorld'}); // 只能用 name
            })
            // localStorage.setItem("userInfo", JSON.stringify(res.res))

            // this.$router.push({path:'/home',query: {id:'123456'}})
            // this.$router.push({name:'HelloWorld', params: {id: res.id}})

          }).catch(e => {
            this.$message.error(e.msg);
            this.getCaptcha()
          })
        } else {
          return false;
        }
      });
    },
    register(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = this.form2.email == '' ? 
            {userName: this.form2.username, password: this.form2.password} :
            {userName: this.form2.username, password: this.form2.password, email: this.form2.email}
          api.register(param).then(res => {
            console.log(res)
            this.$message({
              message: '注册成功！',
              type: 'success'
            });
          }).catch(e => {
            this.$message.error(e.message);
          })
        } else {
          return false;
        }
      });
    }
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  font-size: 12px;
  color: white;
  float: right;
  margin: -20px 20px 0 0;
}
.test {
  width: 100%;
  height: 100%;
  font-family: "宋体";
  background-image: url('../assets/bg.jpg');
  background-position: 40% center;
  background-repeat: no-repeat;
  background-size: cover;
}
.login {
  position: absolute;
  top: 40%;
  left: 80%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 400px;
  text-align: center;
  background: rgba(50, 50, 50, 0.1);
  border-radius: 10px;
}
.title {
  margin-top: 0px;
  margin-bottom: 0px;
  line-height: 50px;
  color: white;
  border-bottom: 1px solid var(--borderColor);
  width: 100%;
  cursor: pointer;
}
.inner {
  margin: 0 42px;
}
.inner >>> .el-form-item{
  margin-bottom: 36px;
}
.inner >>> .el-form-item__label{
  color: white;
}
.inner >>> .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before,
.inner >>> .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  color: transparent;
}
input {
  width: 170px;
  height: 34px;
  border-radius: 5px;
  color: black;
}
span {
  font-size: 12px;
  color: silver;
  margin-left: -80px;
}
button {
  width: 100%;
  height: 36px;
  border-radius: 5px;
  background: #5b8020;
  border: 1px solid silver;
  color: white;
  font-size: 18px;
  margin-top: -10px;
  cursor: pointer;
}
.active {
  color: wheat;
}
.login-captcha {
    height: 0;
    cursor: pointer;
}
.inner >>> .el-input__inner{
  background-color: rgba(50, 50, 50, 0.1);
  color: wheat;
}
</style>