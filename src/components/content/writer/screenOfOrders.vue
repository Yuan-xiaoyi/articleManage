<template>
  <div style="height: 100%; overflow: auto;">
    <div class="modleDiv" style="height: 60%">
      <el-divider class="divHead" content-position="left" >当前事务</el-divider>
      
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
          @change="changeStatus"
        >
        </el-switch>
        <span style="line-height: 40px;">{{onlineStatus ? restText: workText}}</span>
      </div>

      <div style="display: inline-flex;width: 100%;height: calc(100% - 96px)">
        <y-table
          :tableFeilds="tableFeilds"
          :tableData="tableData"
          :needBottom="false"
          style="width: 50%;height: calc(100% + 48px); overflow: hidden"
        ></y-table>
        
        <el-carousel height="100%" style="width: 50%;height: 100%">
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

          <el-timeline-item 
            v-for="(item,index) in notices" :key="index"
            :timestamp="item.createDate" placement="top">
            <el-card>
              <h4>{{item.title}}</h4>
              <p>{{item.content}}</p>
            </el-card>
          </el-timeline-item>

        </el-timeline>
        
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import yTable from "../public/yTable.vue"
import api_User from "../../../api/user"
import api_Order from "../../../api/order"
import api_Notice from '../../../api/notice'
export default {
  name: 'screenOfOrders',
  components: {
    yTable
  },
  data(){
    return{
      userInfo: {},
      onlineStatus: true,
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

      tableData: [],
      tableFeilds: [
        {
          type: "status",
          label: '订单状态',
          prop: "status",
          width: 50,

          btnLabel: '上传稿件',
          btnStyle: '',
          btnEvent: 'upload'
        },{
          label: '稿件名',
          prop: "title"
        },{
          label: '交稿时间',
          prop: "deadline",
          width: 50
        },{
          type: "pay_status",
          label: '结算情况',
          prop: "settlement",
          width: 50
        }
      ],

      notices: []
    }
  },
  mounted(){
    this.chart = document.getElementById('chart');
    this.myChart = echarts.init(this.chart);
    this.changeTu('bar')

    this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
    this.onlineStatus = this.userInfo.status == 2 ? true : false
    
    if(this.$cookie.get('role') == "writer"){
      api_Notice.searchNotice().then(res => {
        this.notices = res.page.list.reverse()
      }).catch(e => {
        this.$message.error(e.msg)
      })

      let param1 = { // 待修改
        userId: this.userInfo.userId,
        status: 3
      }
      let param2 = { // 未初稿
        userId: this.userInfo.userId,
        status: 4
      }
      const arr = [
        api_Order.getOrderList3(param1),
        api_Order.getOrderList3(param2),
        // api_Order.getOrderList3(param3)
      ]
      Promise.all(arr).then(p => {
        p.forEach(e => {
          this.tableData = [...this.tableData, ...e.pOrderEntities]
        })
      })

    }
  },
  methods: {
    changeStatus(val){
      let info = {
        "status": val == true ? 2 : 1,// 1：上班  2：休假
        "userId": this.userInfo.userId
      }
      api_User.changeStatus(info).then(res => {
        this.$message.success(res.msg)
        
        api_User.getUserInfo().then(result =>{
          // 设置userInfo
          this.$cookie.set('userInfo', JSON.stringify(result.user))
          
          this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
        })
      })
    },
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