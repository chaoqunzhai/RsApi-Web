import request from '@/utils/request'

// 查询RsHostIncome列表
export function CardList(query) {
  return request({
    url: '/api/v1/grafana',
    method: 'get',
    params: query
  })
}


export function HostQueryIspMonitor(query) {
  return request({
    url: '/api/v1/grafana/isp',
    method: 'get',
    params: query
  })
}


export function HostQueryPlanBandWidthMonitor(query) {
  return request({
    url: '/api/v1/grafana/plan-bandwidth',
    method: 'get',
    params: query
  })
}

export function HostConvergeMonitor(query) {
  return request({
    url: '/api/v1/grafana/converge',
    method: 'get',
    params: query
  })
}

export function HostQueryMonitor(query) {
  return request({
    url: '/api/v1/grafana/monitor',
    method: 'get',
    params: query
  })
}
