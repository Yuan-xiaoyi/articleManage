import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: {
    menuList: [],
    permList: [],
    hasRoutes: false,
    editableTabsValue: 'Index',
    editableTabs: [{
      title: '首页',
      name: 'Index',
    }],

    orderStatus: [
      {
        label: '全部',
        value: ''
      },{
        label: '待接单',
        value: 2
      },{
        label: '未初稿',
        value: 4
      },{
        label: '待修改',
        value: 3
      },{
        label: '待确认',
        value: 5
      },{
        label: '已完成',
        value: 6
      },
    ],
    settlement: [
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
  },
  mutations: {
    setMenuList(state, menus) {
      state.menuList = menus
    },
    setPermList(state, perms) {
      state.permList = perms
    },
    changeRouteStatus(state, hasRoutes) {
      state.hasRoutes = hasRoutes
    },
    addTab(state, tab) {
      let index = state.editableTabs.findIndex(e => e.name === tab.name)
      if (index === -1) {
        state.editableTabs.push({
          title: tab.title,
          name: tab.name,
        });
      }
      state.editableTabsValue = tab.name;
    },
    resetState: (state) => {
      state.menuList = []
      state.permList = []
      state.hasRoutes = false
      state.editableTabsValue = 'Index'
      state.editableTabs = [{
        title: '首页',
        name: 'Index',
      }]
    }
  },
  actions: {

  },
}