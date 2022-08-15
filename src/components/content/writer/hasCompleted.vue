<template>
  <div>
    <y-search
      :serchFeilds="serchFeilds"
      @getSearch="getSearch"
    ></y-search>

    <el-divider></el-divider>

    <y-table
      :tableFeilds="tableFeilds"
      :tableData="tableData"
      @rowOperation="rowOperation"
      style="height: calc(100vh - 242px); overflow: hidden"
    ></y-table>

  </div>
</template>

<script>
import ySearch from "../public/ySearch.vue"
import yTable from "../public/yTable.vue"
import api from "../../../api/demo/order"
export default {
  name: 'hasCompleted',
  components: {
    ySearch, yTable
  },
  data(){
    return{
      serchFeilds: [
        {
          type: 'input',
          label: '订单名称',
          prop: 'orderName',
        },{
          type: 'select',
          label: '结算情况',
          prop: 'payStatus',
          options: [
            {
              label: '全部',
              value: ''
            },{
              label: '待结算',
              value: '0'
            },{
              label: '已结算',
              value: '1'
            }
          ]
        }
      ],
      tableFeilds: [
        {
          type: "status&btn",
          label: '状态',
          prop: "status",
          width: 50,

          btnLabel: '上传稿件',
          btnStyle: '',
          btnEvent: 'upload'
        },{
          label: '稿件名',
          prop: "name"
        },{
          label: '字数',
          prop: "wordsNum",
          width: 50
        },{
          label: '交稿时间',
          prop: "submitDate",
          width: 50
        },{
          type: "textarea",
          label: '备注',
          prop: "remarks",
        },{
          type: "btn",
          label: '操作',
          prop: "done",
          width: 50,

          btnLabel: '放弃',
          btnStyle: 'danger',
          btnEvent: 'giveup'
        },{
          type: "btn",
          label: '文档内容',
          prop: "content",
          width: 50,

          btnLabel: '下载',
          btnStyle: 'primary',
          btnEvent: 'download'
        }
      ],
      tableData: [
        {
          "status": "1",
          "name": "基于BIM的智慧工地管理体系框架研究",
          "wordsNum": 2600,
          "submitDate": "2022-7-6",
          "remarks": "教材版本：高中德育 根据文件要求排版，文章突出学术性和专业性，语句通顺连贯无错别字，层次分明，围绕德育放方写，查重20内，上传附查重报告。10.10号下午5点交稿",
          "done": true,
          "content": true
        },{
          "status": "2",
          "name": "12",
          "wordsNum": 2600,
          "submitDate": "2022-7-6",
          "remarks": "教材版本：高中德育 根据文件要求排版，文章突出学术性和专业性，语句通顺连贯无错别字，层次分明，围绕德育放方写，查重20内，上传附查重报告。10.10号下午5点交稿",
          "done": true,
          "content": true
        },{
          "status": "3",
          "name": "a管理体系框架研究",
          "wordsNum": 2600,
          "submitDate": "2022-7-6",
          "remarks": "教材版本：高中德育 根据文件要求排版，文章突出学术性和专业性，语句通顺连贯无错别字，层次分明，围绕德育放方写，查重20内，上传附查重报告。10.10号下午5点交稿",
          "done": true,
          "content": true
        },{
          "status": "4",
          "name": "asd",
          "wordsNum": 2600,
          "submitDate": "2022-7-6",
          "remarks": "教材版本：高中德育 根据文件要求排版，文章突出学术性和专业性，语句通顺连贯无错别字，层次分明，围绕德育放方写，查重20内，上传附查重报告。10.10号下午5点交稿",
          "done": true,
          "content": true
        },{
          "status": "5",
          "name": "asdasfasfcaczxcazzzzzzzzzzzzzzz",
          "wordsNum": 2600,
          "submitDate": "2022-7-6",
          "remarks": "教材版本：高中德育 根据文件要求排版，文章突出学术性和专业性，语句通顺连贯无错别字，层次分明，围绕德育放方写，查重20内，上传附查重报告。10.10号下午5点交稿",
          "done": true,
          "content": true
        },

      ]
    }
  },
  methods: {
    getSearch(order){
      console.log(order)
      api.getOrderList(order).then(res => {
        this.tableData = res
      })
    },
    rowOperation(btnEvent, row){
      if(btnEvent == "upload"){
        console.log(btnEvent, row)
      }else if(btnEvent == "giveup"){
        console.log(btnEvent, row)
      }else if(btnEvent == "download"){
        console.log(btnEvent, row)
      }
    },
  }
}
</script>

<style scoped>

</style>