import request from '@/utils/request'

export const getChannels = () => {
  return request({
    url: '/app/v1_0/channels',
    method: 'GET'
  })
}

/**
 * 获取用户列表和默认推荐列表
 */
export const getUserOrDefaultChannel = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'GET'
  })
}

/**
 * 发送请求覆盖我的频道列表, 因为服务端接口问题,使新增频道无法添加,只能覆盖
 */

export const setUserChannels = (channels) => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }

  })
}

export const delUserChannels = id => {
  return request({
    url: `/app/v1_0/user/channels/${id}`,
    method: 'DELETE'
  })
}
