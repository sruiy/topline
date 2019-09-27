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

export const userFollow = userId => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    data: {
      target: userId
    }
  })
}

export const unUserFollow = userId => {
  return request({
    url: `/app/v1_0/user/followings/${userId}`,
    method: 'DELETE'
  })
}
export const getUser = userId => {
  return request({
    url: `/app/v1_0/user`,
    method: 'GET',
    data: {
      target: userId
    }
  })
}
export const UserEdit = () => {
  return request({
    url: `/app/v1_0/user/profile`,
    method: 'GET'
  })
}
export const UserImg = file => {
  const formData = new FormData()
  formData.append('photo', file)

  return request({
    url: `/app/v1_0/user/photo`,
    method: 'PATCH',
    data: formData
  })
}

export const UserProfile = ({
  name,
  gender,
  birthday
}) => {
  return request({
    url: `/app/v1_0/user/profile`,
    method: 'PATCH',
    data: {
      name,
      gender,
      birthday
    }
  })
}
