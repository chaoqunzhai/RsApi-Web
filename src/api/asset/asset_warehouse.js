import request from '@/utils/request'

// 查询AssetWarehouse列表
export function listAssetWarehouse(query) {
  return request({
    url: '/api/v1/asset-warehouse',
    method: 'get',
    params: query
  })
}

// 查询AssetWarehouse详细
export function getAssetWarehouse (id) {
  return request({
    url: '/api/v1/asset-warehouse/' + id,
    method: 'get'
  })
}


// 新增AssetWarehouse
export function addAssetWarehouse(data) {
  return request({
    url: '/api/v1/asset-warehouse',
    method: 'post',
    data: data
  })
}

// 修改AssetWarehouse
export function updateAssetWarehouse(data) {
  return request({
    url: '/api/v1/asset-warehouse/'+data.id,
    method: 'put',
    data: data
  })
}

// 删除AssetWarehouse
export function delAssetWarehouse(data) {
  return request({
    url: '/api/v1/asset-warehouse',
    method: 'delete',
    data: data
  })
}

