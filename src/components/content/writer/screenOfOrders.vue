<template>
  <div style="height: 100%; overflow: auto;">
    <h3 style="margin-top:0">订单大屏</h3>
    <div class="modleDiv" style="height: 45%">
      <el-divider class="divHead" content-position="left" >当前事务（待写的，待结算）</el-divider>
      
      <div style="display: inline-flex;float: left;width: 100%;margin: 0 0 6px 0;">
        <el-button
          type="success" round
          :disabled="onlineStatus"
          style="width: 200px;margin: 0 10px"
          @click="acceptOrder"
        >{{'接单('+ orderNum +')'}}</el-button>
        <el-switch
          style="margin:10px 4px"
          v-model="onlineStatus"
          active-color="gray"
          inactive-color="#13ce66"
        >
        </el-switch>
        <span style="line-height: 40px;">{{onlineStatus ? restText: workText}}</span>
      </div>

      <div style="display: inline-flex;width: 100%;">
        <el-table        
          :data="allOrderData"
          :row-class-name="tableRowClassName"
          :show-header="false"
          height="calc(100% - 96px)"
          style="width: 50%"
        >
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
        </el-table>
        
        <el-carousel height="256px" style="width: 50%">
          <el-carousel-item v-for="(item,index) in images" :key="index"
            :style="{
              backgroundImage: 'url('+ item.value + ')'
            }"
            style="
              background-position: center center;
              background-repeat: no-repeat;
              background-size: cover;
            "
          >
          </el-carousel-item>
        </el-carousel>
      </div>

    </div>

    <div style="width: 100%;display: inline-flex;">
      <div class="modleDiv" style="width:50%">
        <el-divider class="divHead" content-position="left">统计</el-divider>
        
        <div style="border: 1px gray solid">
          <div style="background: aliceblue;text-align: right;">
            <img class="iconImg" src="../../../assets/bar.png" alt="" @click="changeTu('bar')">
            <img class="iconImg" src="../../../assets/pie.png" alt="" @click="changeTu('pie')">
          </div>
          <div id="chart" class="chart"></div>
        </div>
      </div>

      <div class="modleDiv" style="width:50%; max-height: 777px;">
        <el-divider class="divHead" content-position="left">公告</el-divider>
              
        <el-timeline style="height: calc(100% - 48px); overflow: auto">
          <el-timeline-item timestamp="2018/4/2" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/2 20:46</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2018/4/2" placement="top">
            <el-card>
              <h4>更新 Github 模板</h4>
              <p>王小虎 提交于 2018/4/2 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

import api_User from "../../../api/user"
export default {
  name: 'screenOfOrders',
  data(){
    return{
      userInfo: {},
      onlineStatus: false,
      restText: "休息...",
      workText: "上班ing",
      orderNum: 0,
      
      images: [
        {
          value: require("../../../assets/bn1.jpg")
        },
        {
          value: require("../../../assets/bn2.jpg")
        },
        {
          value: require("../../../assets/bn3.jpg")
        },
        {
          value: require("../../../assets/bn4.jpg")
        }
      ],

      chart:{},
      myChart:{},

      allOrderData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ]
    }
  },
  mounted(){
    this.chart = document.getElementById('chart');
    this.myChart = echarts.init(this.chart);
    this.changeTu('bar')
    this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
    if(this.userInfo.status == 2){
      this.onlineStatus = false
    }else if(this.userInfo.status == 1){
      this.onlineStatus = true
    }
  },
  watch: {
    onlineStatus(val) {
      let info = {
        // "id": this.userInfo.,
        "status": val == true ? 2 : 1,
        "userId": this.userInfo.userId
      }
      api_User.changeStatus(info).then(res => {
        this.$message.success(res.msg)
      })
    }
  },
  methods: {
    tableRowClassName({/**row, */ rowIndex}) {
      // console.log(row)
      if (rowIndex === 0) {
        return 'warning-row';
      } else if (rowIndex === 1) {
        return 'success-row';
      }
      return '';
    },
    acceptOrder(){
      if(this.orderNum < 5){
        this.orderNum++
      }
    },
    changeTu(str){
      let optionBar = {
        title: {
          text: 'World Population'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2012',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      };
      let optionPie = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      if(str == 'bar'){
        if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
          this.myChart.dispose();//销毁
          this.myChart = echarts.init(this.chart);
        }
        this.myChart.setOption(optionBar);
      }else if(str == 'pie'){
        if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
          this.myChart.dispose();//销毁
          this.myChart = echarts.init(this.chart);
        }
        this.myChart.setOption(optionPie);
      }
    }
  },
}
</script>

<style scoped>
.modleDiv{
  border: 1px dashed lightgray;
  margin: 2px;
  background-color: white;
  padding: 6px;
}
.divHead{
  margin-top: 24px;
}
.el-divider__text{
  font-weight: 600;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.iconImg{
  width:16px;
  cursor: pointer;
  margin-right: 4px;
}
.chart{
  width: 100%;
  height: 400px;
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>