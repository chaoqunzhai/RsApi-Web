import request from '@/utils/request'

// 查询AssetSupplier列表
export function listAssetSupplier(query) {
  return request({
    url: '/api/v1/asset-supplier',
    method: 'get',
    params: query
  })
}

// 查询AssetSupplier详细
export function getAssetSupplier(id) {
  return request({
    url: '/api/v1/asset-supplier/' + id,
    method: 'get'
  })
}


// 新增AssetSupplier
export function addAssetSupplier(data) {
  return request({
    url: '/api/v1/asset-supplier',
    method: 'post',
    data: data
  })
}

// 修改AssetSupplier
export function updateAssetSupplier(data) {
  return request({
    url: '/api/v1/asset-supplier/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除AssetSupplier
export function delAssetSupplier(data) {
  return request({
    url: '/api/v1/asset-supplier',
    method: 'delete',
    data: data
  })
}

