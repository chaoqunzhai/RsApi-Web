import storage from '@/utils/storage'
const state = {
  region: storage.get('app_region')
}

const mutations = {
  SET_REGION: (state, data) => {
    state.region = data
    storage.set('app_region', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
