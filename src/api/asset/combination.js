import request from '@/utils/request'

// 查询AssetCombination列表
export function listAssetCombination(query) {
  return request({
    url: '/api/v1/asset-combination',
    method: 'get',
    params: query
  })
}

// 查询AssetCombination详细
export function getAssetCombination(id) {
  return request({
    url: '/api/v1/asset-combination/' + id,
    method: 'get'
  })
}


// 新增AssetCombination
export function addAssetCombination(data) {
  return request({
    url: '/api/v1/asset-combination',
    method: 'post',
    data: data
  })
}

// 修改AssetCombination
export function updateAssetCombination(data) {
  return request({
    url: '/api/v1/asset-combination/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除AssetCombination
export function delAssetCombination(data) {
  return request({
    url: '/api/v1/asset-combination',
    method: 'delete',
    data: data
  })
}
export function getHostCountOnLine(query) {
  return request({
    url: '/api/v1/asset-combination/count/online',
    method: 'get',
    params: query
  })
}

// 查询RsHost出库数量
export function getHostAwait(query) {
  return request({
    url: '/api/v1/asset-combination/count/wait',
    method: 'get',
    params: query
  })
}
// 查询RsHost离线
export function getHostCountOffLine(query) {
  return request({
    url: '/api/v1/asset-combination/count/offline',
    method: 'get',
    params: query
  })
}
// // 更新AssetCombination其他信息
export function updateAssetCombinationOtherInfo(data) {
  return request({
    url: '/api/v1/asset-combination/status',
    method: 'post',
    data: data
  })
}
