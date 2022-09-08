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
import api_User from "../../../api/user"
export default {
  name: 'admin_forConfirm',
  components: {
    ySearch, yTable
  },
  data(){
    return{
      serchFeilds: [
        {
          type: 'nameSelect',
          label: '管理员名',
          prop: 'create_user',
          options: []
        },{
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
          label: '交易价格(元)',
          prop: "price",
          width: 50
        },{
          label: '写手应收(元)',
          prop: "money",
          width: 50
        },{
          label: '稿件来源',
          prop: "source",
          width: 50
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
      searchParam: {},
      // currentPage: 1,
      // pagesize: 20,
    }
  },
  created(){
    api_User.getUserList().then(res => {
      let managerList = res.page.list.map(e => {
        if(e.role == "admin"){
          return {
            username: e.username,
            value: e.username
          }
        }
      })
      managerList = managerList.filter(ele=>{return ele!=undefined})
      this.serchFeilds[0].options = [{value: '',username: '所有管理员'}, ...managerList]
    }).catch(e => {
      this.$message.error(e.msg)
    })
  },
  methods: {
    getSearch(order){
      this.searchParam = {status: 6}
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