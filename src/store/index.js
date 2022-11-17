import { createStore } from 'vuex'

export default createStore({
  state: {
    collapse: false,
    tagsList: []
  },
  getters: {
  },
  mutations: {
    handleCollapse(state, data) {
      state.collapse = data;
    },
    // 删除一个tag
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
    },
    //添加一个tag
    setTagsItem(state, data) {
      state.tagsList.push(data);
    },
    // 清除其他tag
    clearTagsOther(state, data) {
      state.tagsList = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
