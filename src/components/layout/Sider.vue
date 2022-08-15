<template>
  <div style="height: 100%;">
    <!-- <div v-for="(item,index) in list" :key="index"
      class="menu"
      :class="{activeItem: acitveIndex == item.index}"
      @click="choose(item)"
    >
      <span class="leftNav">
        <span class="leftText">
          <i v-if="item.icon" :class="item.icon" style="margin-right: 5px;"></i>
          {{item.title}}
        </span>
        
        <span v-if="item.children && item.children.length > 0" class="rightIcon">
          <i v-if="item.show" class="el-icon-caret-top"></i>
          <i v-else class="el-icon-caret-bottom"></i>
        </span>
      </span>

      <div v-if="item.children && item.children.length > 0" style="margin-left: -30px;">
        <div v-for="(childItem, childIndex) in item.children" :key="childIndex"
          class="menu childMenu"
          :class="{actChildItem: item.show,
                   activeItem: acitveIndex == childItem.index}"
          @click.stop="choose(childItem)"
        >
          <span class="leftNav">
            <span class="leftText">
              <i v-if="childItem.icon" :class="childItem.icon" style="margin-right: 5px;"></i>
              {{childItem.title}}
            </span>
          </span>
        </div>
      </div>
      
    </div> -->

    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

      <div v-for="(item,index) in list" :key="index">
        <el-submenu
          v-if="item.children && item.children.length > 0"
          :index="item.index"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <div v-if="item.children && item.children.length > 0">
            <el-menu-item
              v-for="(childItem, childIndex) in item.children" :key="childIndex"
              :index="childItem.index"
              @click="choose(childItem)"
            >
              <i :class="childItem.icon"></i>
              <span>{{childItem.title}}</span>
            </el-menu-item>
          </div>
        </el-submenu>

        <el-menu-item
          v-else :index="item.index"
          @click="choose(item)"
        >
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </el-menu-item>

      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Sider',
  data () {
    return {
      acitveIndex: undefined,
      list: [],
      configList: [
        {
          index: 'w_1',
          icon: 'el-icon-location',
          title: '订单大屏',
          view: 'writer/screenOfOrders',
          limits:['writer'] // "TP"
        },{
          index: 'w_2',
          icon: 'el-icon-location',
          title: '我的订单',
          children: [
            {
              index: '2-1',
              title: '待接单',
              view: 'writer/forOrder'
            },{
              index: '2-2',
              title: '未初稿',
              view: 'writer/unFinished'
            },{
              index: '2-3',
              title: '待修改',
              view: 'writer/forModify'
            },
            {
              index: '2-4',
              title: '待确认',
              view: 'writer/forConfirm'
            },
            {
              index: '2-5',
              title: '已完成',
              view: 'writer/hasCompleted'
            },{
              index: '2-6',
              title: '全部订单',
              view: 'writer/allOrders'
            },
          ],
          limits:['writer']
        },{
          index: 'a_1',
          icon: 'el-icon-location',
          title: '总览大屏',
          view: 'dispatcher/screenOfTotal',
          limits:['admin']
        },{
        //   index: 'a_2',
        //   icon: 'el-icon-location',
        //   title: '注册新人',
        //   view: 'dispatcher/register',
        //   limits:['admin']
        // },{
        //   index: 'a_3',
        //   icon: 'el-icon-location',
        //   title: '创建新单',
        //   view: 'dispatcher/createOrder',
        //   limits:['admin']
        // },{
          index: 'a_4',
          icon: 'el-icon-location',
          title: '所有单子（管理员可视）',
          view: 'dispatcher/sentOrders',
          limits:['admin']
        },{
          index: 't_1',
          icon: 'el-icon-location',
          title: '发布订单需求',
          view: 'thirdP/orderDemand',
          limits:['TP']
        }
      ]
    }
  },
  mounted(){
    let role = this.$cookie.get('role')
    this.configList.map((item) => {
      let j = item.limits.find(e => e == role)
      if(j !== undefined){
        this.list.push(item)
      }
    })
  },
  methods: {
    choose(item){
      this.acitveIndex = item.index
      if(item.view)
        this.getBack(item.view)
    },
    getBack(str){
      this.$emit("childMsg", str);
    }
  }
}
</script>

<style scoped>
  .menu, .childMenu{
    width: 100%;
    height: 56px;
    color: white;
    text-align: left;
    padding-left: 30px;
    display: inline-table;
    cursor: pointer;
  }
  .childMenu{
    padding-left: 60px;
  }
  .menu:hover{
    background-color: rgba(67, 74, 80);
  }
  .childMenu:hover{
    background-color: rgba(67, 74, 80);
  }
  .menu:hover .childMenu{
    background-color: transparent
  }

  .activeItem{
    color: #75e54d !important;
  }

  .actChildItem{
    display: inline-table !important;
  }

  .childMenu{
    display: none;
  }

  .leftNav{
    line-height: 54px;
  }
  .rightIcon{
    position: relative;
    left: 70px;
  }
</style>
