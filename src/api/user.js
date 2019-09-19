import request from '../utils/request'

export const login = ({ mobile,
  code }) => {
  return request({
    url: '/app/v1_0/authorizations',
    data: { mobile,
      code },
    method: 'post'
  })
}
