<template>
  <div style="height: 100%;overflow: auto;">
    <y-search
      :serchFeilds="serchFeilds"
      @getSearch="getSearch"
    ></y-search>

    <el-divider></el-divider>

    <y-table
      :tableFeilds="tableFeilds"
      :tableData="tableData"
      @rowOperation="rowOperation"
      @getNewOrder="getNewOrder"
      style="height: calc(100vh - 235px); overflow: hidden"
    ></y-table>
    <!--@pageOperation="pageOperation"-->
  </div>
</template>

<script>
import ySearch from "../public/ySearch.vue"
import yTable from "../public/yTable.vue"
import api_Order from "../../../api/order"
export default {
  name: 'forOrder',
  components: {
    ySearch, yTable
  },
  data(){
    return{
      serchFeilds: [
        {
          type: 'input',
          label: '订单名称',
          prop: 'title',
        },{
          type: 'select',
          label: '结算情况',
          prop: 'settlement',
          options: this.$store.state.orderStatus.settlement
        }
      ],
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
          label: '字数',
          prop: "wordsnum",
          width: 50
        },{
          label: '交稿时间',
          prop: "deadline",
          width: 50
        },{
          type: "pay_status",
          label: '结算情况',
          prop: "settlement",
          width: 50
        },{
          type: "textarea",
          label: '备注',
          prop: "remark",
        },{
          type: "link",
          label: '详情',
          prop: "detail",
          width: 50,

          linkLabel: '详情',
          btnEvent: 'detail'
        }
      ],
      tableData: [],
      user_id: '',
      searchParam: {},
      // currentPage: 1,
      // pagesize: 20,
    }
  },
  created(){
    let userInfo = this.$cookie.get('userInfo') && JSON.parse(this.$cookie.get('userInfo'))
    this.user_id = userInfo.userId
  },
  methods: {
    getSearch(order){
      this.searchParam = {user_id: this.user_id, status: 2}
      for (let key in order) {
        if (Object.hasOwnProperty.call(order, key)) {
          let element = order[key];
          if(element){
            this.searchParam[key] = element;
          }
        }
      }
      
      this.search()
    },
    search(){
      api_Order.getOrderList3(this.searchParam).then(res => {
        this.tableData = res.orders
      })
    },
    rowOperation(btnEvent, row){
      if(btnEvent == "upload"){
        console.log(btnEvent, row)
      }else if(btnEvent == "giveup"){
        console.log(btnEvent, row)
      }else if(btnEvent == "download"){
        console.log(btnEvent, row)
      }else if(btnEvent == "detail"){
        console.log(btnEvent, row)
      }
    },
    getNewOrder(pagesize, currentPage){
      console.log(pagesize, currentPage)
      this.search()
    },

    // pageOperation(pagesize, currentPage){
    //   this.pagesize = pagesize
    //   this.currentPage = currentPage
    // }
  }
}
</script>

<style scoped>

</style>